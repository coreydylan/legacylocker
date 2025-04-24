import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface PromoCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed_amount';
  amount: number;
  currency?: string | null;
  usage_limit?: number | null;
  usage_count: number;
  starts_at?: string | null;
  expires_at?: string | null;
  min_order_value?: number | null;
  applies_to: 'all' | 'signature' | 'custom' | 'concierge';
  enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

const AdminPromoCodesPage: React.FC = () => {
  const { toast } = useToast();
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [selected, setSelected] = useState<PromoCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state values
  const [form, setForm] = useState<Partial<PromoCode>>({});

  // Fetch promo codes
  useEffect(() => {
    const fetchCodes = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('promo_codes').select('*').order('created_at', { ascending: false });
      if (error) {
        toast({ title: 'Error', description: 'Failed to load promo codes', variant: 'destructive' });
      } else {
        setCodes(data as PromoCode[]);
      }
      setLoading(false);
    };
    fetchCodes();
  }, []);

  // Update form when selected changes
  useEffect(() => {
    if (selected) {
      setForm({ ...selected });
    } else {
      setForm({
        code: '',
        type: 'percentage',
        amount: 0,
        currency: 'USD',
        applies_to: 'all',
        enabled: true,
      });
    }
  }, [selected]);

  // Handle change helper
  const updateField = (field: keyof PromoCode, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.code || !form.amount) {
      toast({ title: 'Validation', description: 'Code and amount are required', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      if (selected) {
        // update
        const { error } = await supabase.from('promo_codes').update({ ...form }).eq('id', selected.id);
        if (error) throw error;
        toast({ title: 'Saved', description: 'Promo code updated' });
      } else {
        const newRow = { id: uuidv4(), usage_count: 0, ...form } as PromoCode;
        const { error } = await supabase.from('promo_codes').insert(newRow);
        if (error) throw error;
        toast({ title: 'Created', description: 'Promo code created' });
      }
      // Refresh list
      const { data } = await supabase.from('promo_codes').select('*').order('created_at', { ascending: false });
      setCodes(data as PromoCode[]);
      // reselect
      const newSel = data?.find((c: PromoCode) => c.code === form.code) || null;
      setSelected(newSel);
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to save promo code', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Promo Codes</h1>
        <Button onClick={() => setSelected(null)}>
          <Plus className="h-4 w-4 mr-2" /> New Code
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Codes list */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Existing Codes</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
            ) : (
              <ul className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {codes.map(c => (
                  <li key={c.id} className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${selected?.id === c.id ? 'bg-legacy-green/10' : 'hover:bg-gray-100'}`} onClick={() => setSelected(c)}>
                    <span>{c.code.toUpperCase()}</span>
                    {!c.enabled && <span className="text-xs text-red-600">Disabled</span>}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{selected ? 'Edit Promo Code' : 'Create Promo Code'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Code</Label>
                <Input value={form.code || ''} onChange={e => updateField('code', e.target.value)} placeholder="e.g. SPRING10" />
              </div>
              <div>
                <Label>Type</Label>
                <Select value={form.type || 'percentage'} onValueChange={v => updateField('type', v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Amount</Label>
                <Input type="number" value={form.amount ?? ''} onChange={e => updateField('amount', Number(e.target.value))} />
              </div>
              {form.type === 'fixed_amount' && (
                <div>
                  <Label>Currency</Label>
                  <Input value={form.currency || 'USD'} onChange={e => updateField('currency', e.target.value)} />
                </div>
              )}
              <div>
                <Label>Usage Limit</Label>
                <Input type="number" value={form.usage_limit ?? ''} onChange={e => updateField('usage_limit', Number(e.target.value) || null)} placeholder="Leave blank for unlimited" />
              </div>
              <div>
                <Label>Min Order Value</Label>
                <Input type="number" value={form.min_order_value ?? ''} onChange={e => updateField('min_order_value', Number(e.target.value) || null)} placeholder="Optional" />
              </div>
              <div>
                <Label>Applies To</Label>
                <Select value={form.applies_to || 'all'} onValueChange={v => updateField('applies_to', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="signature">Signature</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                    <SelectItem value="concierge">Concierge</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Enabled</Label>
                <Select value={form.enabled ? 'true' : 'false'} onValueChange={v => updateField('enabled', v === 'true')}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Start Date</Label>
                <Input type="date" value={form.starts_at ? form.starts_at.substring(0,10) : ''} onChange={e => updateField('starts_at', e.target.value || null)} />
              </div>
              <div>
                <Label>End Date</Label>
                <Input type="date" value={form.expires_at ? form.expires_at.substring(0,10) : ''} onChange={e => updateField('expires_at', e.target.value || null)} />
              </div>
              <div className="col-span-full">
                <Button onClick={handleSave} disabled={saving} className="mt-4">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPromoCodesPage; 