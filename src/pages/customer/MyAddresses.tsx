import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ArrowLeft, MapPin, Home, Plus, Star, Trash2, Bath, ChefHat, Sofa, Layers, Sparkles, Square } from "lucide-react";
import { toast } from "sonner";
import MobileNav from "@/components/MobileNav";

const MyAddresses = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    label: "",
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    country: "Portugal",
    currency: "EUR",
    is_primary: false,
    property_type: "Apartment",
    layout_type: "Studio",
    package_code: "C1",
    rua: "",
    codigo_postal: "",
    localidade: "",
    distrito: "",
    porta_andar: "",
    street: "",
    apt_unit: "",
    city: "",
    province: "",
    postal_code: ""
  });

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData?.role !== 'customer') {
        navigate('/provider/dashboard');
        return;
      }

      setFormData(prev => ({
        ...prev,
        email: profileData.email,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        country: profileData.country,
        currency: profileData.currency
      }));

      const { data: addressesData } = await supabase
        .from('customer_addresses')
        .select('*, cleaning_packages(*)')
        .eq('customer_id', user.id)
        .order('is_primary', { ascending: false });

      setAddresses(addressesData || []);

      const { data: packagesData } = await supabase
        .from('cleaning_packages')
        .select('*')
        .order('bedroom_count');

      setPackages(packagesData || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (addresses.length >= 5 && !editingAddress) {
      toast.error('Maximum 5 addresses allowed');
      return;
    }

    if (formData.is_primary) {
      await supabase
        .from('customer_addresses')
        .update({ is_primary: false })
        .neq('id', editingAddress?.id || '');
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (editingAddress) {
        const { error } = await supabase
          .from('customer_addresses')
          .update(formData)
          .eq('id', editingAddress.id);

        if (error) throw error;
        toast.success('Address updated successfully');
      } else {
        const { error } = await supabase
          .from('customer_addresses')
          .insert([{ ...formData, customer_id: user!.id }]);

        if (error) throw error;
        toast.success('Address added successfully');
      }

      setIsOpen(false);
      setEditingAddress(null);
      checkAuthAndFetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save address');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const { error } = await supabase
        .from('customer_addresses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Address deleted');
      checkAuthAndFetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete address');
    }
  };

  const openAddForm = () => {
    setEditingAddress(null);
    setFormData({
      label: "",
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone: "",
      email: formData.email,
      country: formData.country,
      currency: formData.currency,
      is_primary: addresses.length === 0,
      property_type: "Apartment",
      layout_type: "Studio",
      package_code: "C1",
      rua: "",
      codigo_postal: "",
      localidade: "",
      distrito: "",
      porta_andar: "",
      street: "",
      apt_unit: "",
      city: "",
      province: "",
      postal_code: ""
    });
    setIsOpen(true);
  };

  const openEditForm = (address: any) => {
    setEditingAddress(address);
    setFormData(address);
    setIsOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background pb-mobile-nav">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 safe-top">
        <div className="mobile-container py-3 sm:py-4 flex items-center gap-3 sm:gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/customer/dashboard')} className="touch-target md:hidden">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            My Addresses
          </h1>
        </div>
      </header>

      <main className="mobile-container py-4 sm:py-8 max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage up to 5 addresses ({addresses.length}/5)
          </p>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button onClick={openAddForm} disabled={addresses.length >= 5} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Address
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto w-full sm:max-w-xl p-4 sm:p-6">
              <SheetHeader>
                <SheetTitle>
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </SheetTitle>
              </SheetHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                <div>
                  <Label>Address Label *</Label>
                  <Input
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="Home, Office, etc."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>First Name *</Label>
                    <Input
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Last Name *</Label>
                    <Input
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Phone *</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Email *</Label>
                    <Input
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      type="email"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Country *</Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) => setFormData({
                        ...formData,
                        country: value,
                        currency: value === 'Portugal' ? 'EUR' : 'CAD'
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Portugal">🇵🇹 Portugal</SelectItem>
                        <SelectItem value="Canada">🇨🇦 Canada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Property Type *</Label>
                    <Select
                      value={formData.property_type}
                      onValueChange={(value) => setFormData({ ...formData, property_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Apartment">Apartment</SelectItem>
                        <SelectItem value="House">House</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Layout Type *</Label>
                  <Select
                    value={formData.layout_type}
                    onValueChange={(value) => {
                      const pkg = packages.find(p => 
                        p.package_name.toLowerCase().includes(value.toLowerCase())
                      );
                      setFormData({
                        ...formData,
                        layout_type: value,
                        package_code: pkg?.package_code || formData.package_code
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Studio">Studio</SelectItem>
                      <SelectItem value="1 Bedroom">1 Bedroom</SelectItem>
                      <SelectItem value="2 Bedrooms">2 Bedrooms</SelectItem>
                      <SelectItem value="3 Bedrooms">3 Bedrooms</SelectItem>
                      <SelectItem value="4 Bedrooms">4 Bedrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.country === 'Portugal' ? (
                  <>
                    <div>
                      <Label>Rua *</Label>
                      <Input
                        value={formData.rua}
                        onChange={(e) => setFormData({ ...formData, rua: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Código Postal *</Label>
                        <Input
                          value={formData.codigo_postal}
                          onChange={(e) => setFormData({ ...formData, codigo_postal: e.target.value })}
                          placeholder="1000-001"
                          required
                        />
                      </div>
                      <div>
                        <Label>Porta/Andar</Label>
                        <Input
                          value={formData.porta_andar}
                          onChange={(e) => setFormData({ ...formData, porta_andar: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Localidade *</Label>
                        <Input
                          value={formData.localidade}
                          onChange={(e) => setFormData({ ...formData, localidade: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Distrito *</Label>
                        <Input
                          value={formData.distrito}
                          onChange={(e) => setFormData({ ...formData, distrito: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Label>Street Address *</Label>
                      <Input
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Apt/Unit</Label>
                        <Input
                          value={formData.apt_unit}
                          onChange={(e) => setFormData({ ...formData, apt_unit: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Postal Code *</Label>
                        <Input
                          value={formData.postal_code}
                          onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                          placeholder="A1A 1A1"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>City *</Label>
                        <Input
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Province *</Label>
                        <Input
                          value={formData.province}
                          onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_primary"
                    checked={formData.is_primary}
                    onChange={(e) => setFormData({ ...formData, is_primary: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="is_primary">Set as primary address</Label>
                </div>

                <Button type="submit" className="w-full">
                  {editingAddress ? 'Update Address' : 'Save Address'}
                </Button>
              </form>
            </SheetContent>
          </Sheet>
        </div>

        {addresses.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-12 pb-12 text-center">
              <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                No addresses saved yet
              </p>
              <Button onClick={openAddForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Address
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <Card key={address.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-gradient-to-br from-card via-card to-accent/5">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-2 border-primary/20 backdrop-blur-sm">
                          {address.property_type === 'House' ? (
                            <Home className="w-7 h-7 text-primary" />
                          ) : (
                            <div className="flex flex-col gap-0.5">
                              <div className="flex gap-0.5">
                                <div className="w-1.5 h-1.5 rounded-sm bg-primary"></div>
                                <div className="w-1.5 h-1.5 rounded-sm bg-primary"></div>
                              </div>
                              <div className="flex gap-0.5">
                                <div className="w-1.5 h-1.5 rounded-sm bg-primary"></div>
                                <div className="w-1.5 h-1.5 rounded-sm bg-primary"></div>
                              </div>
                              <div className="flex gap-0.5">
                                <div className="w-1.5 h-1.5 rounded-sm bg-primary"></div>
                                <div className="w-1.5 h-1.5 rounded-sm bg-primary"></div>
                              </div>
                            </div>
                          )}
                        </div>
                        {address.is_primary && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center border-2 border-card">
                            <Star className="w-3 h-3 text-yellow-900 fill-yellow-900" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg font-bold">{address.label}</CardTitle>
                          {address.is_primary && (
                            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 text-yellow-700 dark:text-yellow-300 border border-yellow-400/30">
                              Primary
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-foreground/70">
                          {address.first_name} {address.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {address.property_type} • {address.layout_type}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditForm(address)}
                        className="border-primary/20 hover:bg-primary/10 hover:border-primary/40"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(address.id)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <div className="px-6 pb-1">
                  <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
                </div>

                <CardContent className="pt-4 space-y-4">
                  <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Address</p>
                        <p className="text-sm font-medium leading-relaxed">
                          {address.country === 'Portugal' ? (
                            <>
                              {address.rua}
                              {address.porta_andar && <>, {address.porta_andar}</>}
                              <br />
                              {address.codigo_postal} {address.localidade}
                              <br />
                              {address.distrito}, {address.country} 🇵🇹
                            </>
                          ) : (
                            <>
                              {address.street}
                              {address.apt_unit && <>, {address.apt_unit}</>}
                              <br />
                              {address.city}, {address.province}
                              <br />
                              {address.postal_code}, {address.country} 🇨🇦
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {address.cleaning_packages && (
                    <div className="bg-gradient-to-br from-primary/5 to-accent/10 rounded-xl p-4 border border-primary/20">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Cleaning Package</p>
                          <p className="font-bold text-base">{address.cleaning_packages.package_name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {address.cleaning_packages.time_included} included
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            {address.currency === 'EUR' ? '€' : '$'}
                            {address.cleaning_packages.recurring_price}
                          </p>
                          <p className="text-xs font-medium text-muted-foreground">recurring</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Included Services</p>
                        <div className="grid grid-cols-3 gap-2">
                          {address.cleaning_packages.areas_included?.map((area: string, idx: number) => {
                            const getServiceIcon = (service: string) => {
                              switch(service.toLowerCase()) {
                                case 'bathroom': return <Bath className="w-4 h-4" />;
                                case 'kitchen': return <ChefHat className="w-4 h-4" />;
                                case 'livingroom': return <Sofa className="w-4 h-4" />;
                                case 'floors': return <Layers className="w-4 h-4" />;
                                case 'dusting': return <Sparkles className="w-4 h-4" />;
                                case 'surfaces': return <Square className="w-4 h-4" />;
                                default: return <Square className="w-4 h-4" />;
                              }
                            };
                            
                            return (
                              <div key={idx} className="flex items-center gap-1.5 bg-card/80 backdrop-blur-sm rounded-lg p-2 border border-border/50 hover:border-primary/30 transition-colors">
                                <span className="text-primary flex-shrink-0">
                                  {getServiceIcon(area)}
                                </span>
                                <span className="text-xs font-medium capitalize truncate">{area}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm bg-muted/20 rounded-lg p-3 border border-border/30">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-xs font-semibold text-muted-foreground">📞</span>
                      <span className="font-medium">{address.phone}</span>
                    </div>
                    <div className="w-px h-6 bg-border"></div>
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-xs font-semibold text-muted-foreground">✉️</span>
                      <span className="font-medium truncate">{address.email}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      <MobileNav />
    </div>
  );
};

export default MyAddresses;
