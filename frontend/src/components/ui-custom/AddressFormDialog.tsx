import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAddressMutations } from '@/hooks/useApi';
import { toast } from 'sonner';
import type { Address } from '@/types';

interface AddressFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    addressToEdit?: Address | null;
    onSuccess: () => void;
}

interface FormData {
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    type: 'shipping' | 'billing';
    isDefault: boolean;
}

export function AddressFormDialog({ open, onOpenChange, addressToEdit, onSuccess }: AddressFormDialogProps) {
    const { isHindi } = useLanguage();
    const { createAddress, updateAddress, loading } = useAddressMutations();
    const [submitting, setSubmitting] = useState(false);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            name: '',
            phone: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            pincode: '',
            country: 'India',
            type: 'shipping',
            isDefault: false
        }
    });

    useEffect(() => {
        if (addressToEdit) {
            setValue('name', addressToEdit.name);
            setValue('phone', addressToEdit.phone);
            setValue('addressLine1', addressToEdit.addressLine1);
            setValue('addressLine2', addressToEdit.addressLine2 || '');
            setValue('city', addressToEdit.city);
            setValue('state', addressToEdit.state);
            setValue('pincode', addressToEdit.pincode);
            setValue('country', addressToEdit.country);
            setValue('type', addressToEdit.type);
            setValue('isDefault', addressToEdit.isDefault);
        } else {
            reset({
                name: '',
                phone: '',
                addressLine1: '',
                addressLine2: '',
                city: '',
                state: '',
                pincode: '',
                country: 'India',
                type: 'shipping',
                isDefault: false
            });
        }
    }, [addressToEdit, open, setValue, reset]);

    const onSubmit = async (data: FormData) => {
        setSubmitting(true);
        try {
            let result;
            if (addressToEdit) {
                result = await updateAddress(addressToEdit.id, data);
            } else {
                result = await createAddress(data);
            }

            if (result) {
                toast.success(isHindi ? 'पता सफलतापूर्वक सहेजा गया' : 'Address saved successfully');
                onSuccess();
                onOpenChange(false);
            }
        } catch (error) {
            console.error(error);
            toast.error(isHindi ? 'पता सहेजने में विफल' : 'Failed to save address');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {addressToEdit
                            ? (isHindi ? 'पता संपादित करें' : 'Edit Address')
                            : (isHindi ? 'नया पता जोड़ें' : 'Add New Address')}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">{isHindi ? 'नाम' : 'Name'}</Label>
                            <Input id="name" {...register('name', { required: true })} />
                            {errors.name && <span className="text-xs text-red-500">Required</span>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">{isHindi ? 'फ़ोन' : 'Phone'}</Label>
                            <Input id="phone" {...register('phone', { required: true })} />
                            {errors.phone && <span className="text-xs text-red-500">Required</span>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="addressLine1">{isHindi ? 'पता पंक्ति 1' : 'Address Line 1'}</Label>
                        <Input id="addressLine1" {...register('addressLine1', { required: true })} />
                        {errors.addressLine1 && <span className="text-xs text-red-500">Required</span>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="addressLine2">{isHindi ? 'पता पंक्ति 2 (वैकल्पिक)' : 'Address Line 2 (Optional)'}</Label>
                        <Input id="addressLine2" {...register('addressLine2')} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">{isHindi ? 'शहर' : 'City'}</Label>
                            <Input id="city" {...register('city', { required: true })} />
                            {errors.city && <span className="text-xs text-red-500">Required</span>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="state">{isHindi ? 'राज्य' : 'State'}</Label>
                            <Input id="state" {...register('state', { required: true })} />
                            {errors.state && <span className="text-xs text-red-500">Required</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="pincode">{isHindi ? 'पिन कोड' : 'Pincode'}</Label>
                            <Input id="pincode" {...register('pincode', { required: true })} />
                            {errors.pincode && <span className="text-xs text-red-500">Required</span>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="country">{isHindi ? 'देश' : 'Country'}</Label>
                            <Input id="country" {...register('country', { required: true })} defaultValue="India" />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isDefault"
                            onCheckedChange={(checked) => setValue('isDefault', checked === true)}
                        />
                        <Label htmlFor="isDefault">{isHindi ? 'डिफ़ॉल्ट पते के रूप में सेट करें' : 'Set as default address'}</Label>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            {isHindi ? 'रद्द करें' : 'Cancel'}
                        </Button>
                        <Button type="submit" disabled={loading || submitting} className="bg-saffron text-white hover:bg-saffron-dark">
                            {(loading || submitting) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isHindi ? 'सहेजें' : 'Save Address'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
