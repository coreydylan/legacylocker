import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input"; // For potential inline editing
import { useToast } from "@/components/ui/use-toast";
import { PlusSquare, Save, Loader2 } from 'lucide-react';
import { format, getMonth, getYear } from 'date-fns'; // For displaying month/year

// Interface based on schema
interface MonthlyCardSetting {
  id: string; // uuid
  order_id: string; // uuid
  month: number; // integer
  year: number; // integer
  enabled?: boolean | null;
  ship_date?: string | null; // date
  artwork_option?: string | null; // text
  title?: string | null; // text
  // Add other fields as needed: story, footer_message, occasion, recipients, photo_url, locks
}

interface MonthlySettingsTableProps {
  orderId: string;
}

const getMonthName = (monthNumber: number): string => {
  // monthNumber is 1-based in typical usage, but Date expects 0-based
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return format(date, 'MMMM');
};

const formatDateForInput = (dateString: string | undefined | null): string => {
  if (!dateString) return '';
  try {
    return format(new Date(dateString + 'T00:00:00'), 'yyyy-MM-dd');
  } catch {
    return '';
  }
};

const MonthlySettingsTable: React.FC<MonthlySettingsTableProps> = ({ orderId }) => {
  const [settings, setSettings] = useState<MonthlyCardSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  
  // State for inline editing (optional, start simple)
  // const [editingRowId, setEditingRowId] = useState<string | null>(null);
  // const [rowData, setRowData] = useState<Partial<MonthlyCardSetting>>({});

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('monthly_card_settings')
        .select('*')
        .eq('order_id', orderId)
        .order('year', { ascending: true })
        .order('month', { ascending: true });

      if (fetchError) throw fetchError;
      setSettings(data || []);
    } catch (err: any) {
      console.error('Error fetching monthly settings:', err);
      setError('Failed to fetch monthly settings.');
      setSettings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [orderId]);

  const handleGenerateDefaults = async () => {
      setIsGenerating(true);
      console.log("Generate Defaults clicked for order:", orderId);
      alert("Placeholder: Generate default monthly settings");
      // TODO: Implement logic to calculate next 12 months 
      //       and upsert default settings into Supabase.
      //       Use fetchSettings() to refresh after generation.
      // Example structure (needs refinement):
      // const defaults = [...]; // Array of default setting objects
      // const { error } = await supabase.from('monthly_card_settings').upsert(defaults, { onConflict: 'order_id, year, month' });
      // if (!error) fetchSettings(); else toast(...);
      setIsGenerating(false);
  };
  
  // Placeholder for updating a single setting (e.g., toggling enabled)
  const handleUpdateSetting = async (settingId: string, updates: Partial<MonthlyCardSetting>) => {
    // TODO: Implement inline save logic for a specific row/field
     console.log('Update setting:', settingId, updates);
     alert('Placeholder: Update setting');
     // Example:
     // const { error } = await supabase.from('monthly_card_settings').update(updates).eq('id', settingId);
     // if (!error) fetchSettings(); else toast(...);
  };

  if (loading) return <p>Loading monthly settings...</p>;
  if (error) return <p className="text-red-500">Error loading settings: {error}</p>;

  return (
    <div>
      <div className="flex justify-end mb-4">
         <Button size="sm" onClick={handleGenerateDefaults} disabled={isGenerating}>
          {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusSquare className="mr-2 h-4 w-4" />}
           {isGenerating ? 'Generating...' : 'Generate Defaults (12 Mo)'}
        </Button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month / Year</TableHead>
              <TableHead>Enabled</TableHead>
              <TableHead>Ship Date Override</TableHead>
              <TableHead>Artwork Option</TableHead>
              {/* <TableHead>Title</TableHead> */}
              <TableHead className="text-right">Actions</TableHead> { /* For Save button if inline editing */ }
            </TableRow>
          </TableHeader>
          <TableBody>
            {settings.length > 0 ? (
              settings.map((setting) => (
                <TableRow key={setting.id}>
                  <TableCell className="font-medium">
                    {getMonthName(setting.month)} {setting.year}
                  </TableCell>
                  <TableCell>
                     {/* Inline Switch example */}
                     <Switch 
                        checked={setting.enabled || false}
                        onCheckedChange={(checked) => handleUpdateSetting(setting.id, { enabled: checked })}
                        // Consider adding disabled state while saving
                      />
                  </TableCell>
                  <TableCell>
                    {/* TODO: Replace with DatePicker for editing */}
                    {formatDateForInput(setting.ship_date) || 'Default'}
                  </TableCell>
                  <TableCell>{setting.artwork_option || 'Default'}</TableCell>
                  {/* <TableCell>{setting.title || '-'}</TableCell> */}
                  <TableCell className="text-right">
                     {/* Placeholder for row-level save/edit actions if needed */}
                     {/* <Button variant="ghost" size="sm">Edit</Button> */}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  No monthly settings found. Use "Generate Defaults" to create them.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MonthlySettingsTable; 