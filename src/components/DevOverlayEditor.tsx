import React, { useEffect, useState, useCallback, useRef } from 'react';
// @ts-ignore - react-rnd lacks type declaration in this project until installed
import { Rnd } from 'react-rnd';

/*
 -----------------------------------------------------------------------------
  DevOverlayEditor – drop-in developer-only drag/resize/text edit overlay
 -----------------------------------------------------------------------------
  How it works
  • A special query param (?editMode=true) activates edit capabilities *only* in
    development (import.meta.env.DEV)
  • Each direct child of <DevOverlayEditor> that has an `id` prop becomes an
    editable block.  Position, size and edited innerHTML are stored in
    localStorage under the key `devOverlay_<id>`.
  • A fixed control panel (top-right) lets you reset, exit, or generate a
    Cursor prompt that describes the current layout/text changes.
  • Intended to be toggled from a button inside your /admin route.  Example:
      const enableEditMode = () => {
        const url = new URL(window.location.href);
        url.searchParams.set('editMode', 'true');
        window.history.replaceState({}, '', url.toString());
        window.location.reload(); // or use React-state navigation
      };
 -----------------------------------------------------------------------------
  Minimal usage inside App.tsx
  ---------------------------------------------------------------------------
  import DevOverlayEditor from './components/DevOverlayEditor';
  
  function App() {
    const isDev = import.meta.env.DEV;
    const params = new URLSearchParams(window.location.search);
    const editMode = params.get('editMode') === 'true';

    const appBody = (
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    );

    return isDev && editMode ? (
      <DevOverlayEditor>{appBody}</DevOverlayEditor>
    ) : (
      appBody
    );
  }
  ---------------------------------------------------------------------------
*/

interface DevOverlayEditorProps {
  children: React.ReactNode;
}

type SavedBlockState = {
  x: number;
  y: number;
  width: number;
  height: number;
  html: string;
};

const STORAGE_PREFIX = 'devOverlay_';

const loadState = (id: string): Partial<SavedBlockState> => {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
    return raw ? (JSON.parse(raw) as SavedBlockState) : {};
  } catch (e) {
    console.warn('DevOverlayEditor: failed to parse saved state for', id, e);
    return {};
  }
};

const saveState = (id: string, state: Partial<SavedBlockState>) => {
  try {
    const current = loadState(id);
    const merged = { ...current, ...state } as SavedBlockState;
    localStorage.setItem(`${STORAGE_PREFIX}${id}`, JSON.stringify(merged));
  } catch (e) {
    console.error('DevOverlayEditor: failed to save state for', id, e);
  }
};

/* ------------------------------------------------------------------------- */
function EditableBlock({ id, children }: { id: string; children: React.ReactElement }) {
  const initial = loadState(id);
  const [position, setPosition] = useState({ x: initial.x ?? 0, y: initial.y ?? 0 });
  const [size, setSize] = useState({ width: initial.width ?? 'auto', height: initial.height ?? 'auto' });
  const [html, setHtml] = useState<string | undefined>(initial.html);
  const contentRef = useRef<HTMLDivElement>(null);

  // Persist position / size when they change
  useEffect(() => {
    saveState(id, { x: position.x, y: position.y, width: typeof size.width === 'number' ? size.width : 0, height: typeof size.height === 'number' ? size.height : 0 });
  }, [id, position, size]);

  // Persist html when edited
  const handleBlur = useCallback(() => {
    if (contentRef.current) {
      const newHtml = contentRef.current.innerHTML;
      setHtml(newHtml);
      saveState(id, { html: newHtml });
    }
  }, [id]);

  return (
    <Rnd
      default={{
        x: position.x,
        y: position.y,
        width: size.width,
        height: size.height,
      }}
      bounds="window"
      onDragStop={(_, d) => {
        setPosition({ x: d.x, y: d.y });
      }}
      onResizeStop={(_, __, ref, ___, newPos) => {
        setSize({ width: ref.offsetWidth, height: ref.offsetHeight });
        setPosition({ x: newPos.x, y: newPos.y });
      }}
      style={{ border: '1px dashed #1e90ff', zIndex: 10000 }}
    >
      <div
        ref={contentRef}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        style={{ outline: 'none', cursor: 'text', width: '100%', height: '100%' }}
        // If we previously saved html, use it. Otherwise render the children as-is.
        dangerouslySetInnerHTML={html ? { __html: html } : undefined}
      >
        {!html && children}
      </div>
    </Rnd>
  );
}

/* ------------------------------------------------------------------------- */
const ControlPanel: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [, toggle] = useState(false); // dummy to force rerender when needed

  const resetLayout = () => {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(STORAGE_PREFIX))
      .forEach((k) => localStorage.removeItem(k));
    window.location.reload();
  };

  const generatePrompt = () => {
    const changes = Object.keys(localStorage)
      .filter((k) => k.startsWith(STORAGE_PREFIX))
      .map((k) => {
        const id = k.replace(STORAGE_PREFIX, '');
        const data = loadState(id);
        return `Block "${id}" => position (${data.x}, ${data.y}), size (${data.width}×${data.height}), text: \n"${(data.html || '').replace(/\n/g, ' ')}"`;
      })
      .join('\n\n');
    const prompt = `Please apply the following layout/text tweaks:\n\n${changes}`;
    navigator.clipboard.writeText(prompt).then(() => {
      alert('Cursor prompt copied to clipboard!');
    });
    toggle((s) => !s);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 10,
        right: 10,
        zIndex: 11000,
        background: 'rgba(0,0,0,0.8)',
        color: '#fff',
        padding: '8px 12px',
        borderRadius: 4,
        fontSize: 12,
        display: 'flex',
        gap: 8,
      }}
    >
      <button onClick={resetLayout}>Reset layout</button>
      <button onClick={generatePrompt}>Copy prompt</button>
      <button
        onClick={() => {
          onExit();
        }}
      >
        Exit edit
      </button>
    </div>
  );
};

/* ------------------------------------------------------------------------- */
const DevOverlayEditor: React.FC<DevOverlayEditorProps> = ({ children }) => {
  const [active, setActive] = useState(false);

  // Activate if ?editMode=true AND in dev.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (import.meta.env.DEV && params.get('editMode') === 'true') {
      setActive(true);
    }
  }, []);

  const exitEditMode = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('editMode');
    window.history.replaceState({}, '', url.toString());
    window.location.reload();
  };

  if (!active) return <>{children}</>;

  // Enhance each *direct* child having an `id` prop.
  const enhanced = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    const id = (child.props as any).id;
    if (!id) return child;
    return (
      <EditableBlock key={id} id={id}>
        {child}
      </EditableBlock>
    );
  });

  return (
    <>
      {enhanced}
      <ControlPanel onExit={exitEditMode} />
    </>
  );
};

export default DevOverlayEditor; 