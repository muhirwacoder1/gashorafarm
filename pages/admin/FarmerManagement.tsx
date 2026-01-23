import React from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Leaf, MapPin, Phone, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/Button';

export const FarmerManagement: React.FC = () => {
    const farmers = useQuery(api.farmers.list) ?? [];
    const verifyFarmer = useMutation(api.farmers.verifyFarmer);

    const handleVerify = async (farmerId: any) => {
        try {
            await verifyFarmer({ farmerId });
        } catch (error) {
            console.error('Error verifying farmer:', error);
        }
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-stone-900">Farmer Management</h1>
                <p className="text-stone-500 mt-1">Manage farmer accounts and verification</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {farmers.map((farmer) => (
                    <div key={farmer._id} className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
                        <div className="flex items-start gap-4 mb-4">
                            <img src={farmer.imageUrl} alt={farmer.name} className="w-16 h-16 rounded-2xl object-cover" />
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-stone-900">{farmer.name}</h3>
                                {farmer.verified ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-lime-100 text-lime-700 text-xs font-bold rounded-full">
                                        <CheckCircle className="h-3 w-3" />
                                        Verified
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                                        <XCircle className="h-3 w-3" />
                                        Pending
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-stone-600">
                                <MapPin className="h-4 w-4 text-lime-600" />
                                {farmer.location}
                            </div>
                            {farmer.phone && (
                                <div className="flex items-center gap-2 text-sm text-stone-600">
                                    <Phone className="h-4 w-4 text-lime-600" />
                                    {farmer.phone}
                                </div>
                            )}
                            {farmer.idNumber && (
                                <div className="flex items-center gap-2 text-sm text-stone-600">
                                    <CreditCard className="h-4 w-4 text-lime-600" />
                                    {farmer.idNumber}
                                </div>
                            )}
                        </div>

                        {!farmer.verified && (
                            <Button
                                onClick={() => handleVerify(farmer._id)}
                                fullWidth
                                className="bg-lime-500 hover:bg-lime-600 rounded-xl"
                            >
                                Verify Farmer
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
