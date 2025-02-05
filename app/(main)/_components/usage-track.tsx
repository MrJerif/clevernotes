"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/clerk-react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Spinner } from '@/components/spinner';

if (process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID === undefined) {
    throw new Error("PayPal Client ID is not defined");
}

const UsageTrack = () => {
    const { user } = useUser();
    const router = useRouter();
    const [submitting, setSubmitting] = useState<number | null>(null);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    // Tokens
    const [userTokens, setUserTokens] = useState<number>();
    const getTokens = useQuery(api.documents.getTokens);
    const createTokens = useMutation(api.documents.createToken);
    const buyTokens = useMutation(api.documents.buyTokens);

    const price = {
        basic: 0.50,
        basic2: 0.80,
        medium: 1.39,
        medium2: 2.30,
        large: 3.46,
        premium: 4.33,
    };

    useEffect(() => {
        if (user?.id) {
            createTokens({
                userId: user.id
            });
        }
    }, [user?.id]);

    useEffect(() => {
        if (getTokens && getTokens.length > 0) {
            setUserTokens(getTokens[0].tokenCount);
        }
    }, [getTokens]);

    // function to handle payments
    const onPaymentSuccess = async (): Promise<void> => {
        if (!user?.id) {
            router.push("/login");
        }

        try {
            if (user?.id && selectedOption) {
                buyTokens({
                    userId: user?.id,
                    tokenCount: selectedOption,
                });
            }
        } catch (error) {
            console.log('Error in payment Process => ', error);
        } finally {
            router.push(window.location.pathname);
            setSelectedOption(null);
        }
    };

    return (
        <PayPalScriptProvider options={{
            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
            currency: "USD",
            intent: "capture"
        }}
        >
            <div className='m-1'>
                <div className='rounded-lg p-1'>
                    <div className='flex justify-between'>
                        <div
                            className='flex gap-1 items-center'
                        >
                            <h2 className='font-medium'>Credits</h2>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="#f8e71c" fill="none">
                                    <path d="M11.5384 7.2534C11.7534 6.91553 12.2466 6.91553 12.4616 7.2534L13.0837 8.23082C13.7716 9.3117 14.6883 10.2284 15.7692 10.9163L16.7466 11.5384C17.0845 11.7534 17.0845 12.2466 16.7466 12.4616L15.7692 13.0837C14.6883 13.7716 13.7716 14.6883 13.0837 15.7692L12.4616 16.7466C12.2466 17.0845 11.7534 17.0845 11.5384 16.7466L10.9163 15.7692C10.2284 14.6883 9.3117 13.7716 8.23082 13.0837L7.2534 12.4616C6.91553 12.2466 6.91553 11.7534 7.2534 11.5384L8.23082 10.9163C9.3117 10.2284 10.2284 9.3117 10.9163 8.23082L11.5384 7.2534Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                                </svg>
                            </div>
                        </div>
                        <div className='text-sm mt-1'>{userTokens} tokens left</div>
                    </div>
                </div>
                <Dialog>
                    <DialogTrigger className='h-7 w-full'>
                        <div
                            className='h-6 w-full bg-[#9981f9] rounded-md'
                        >
                            Buy tokens
                        </div>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Purchase Tokens</DialogTitle>
                            <DialogDescription className='grid grid-cols-3 justify-between'>
                                <Card className='h-40 w-32 mb-2'>
                                    <CardHeader>
                                        <CardTitle>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="70%" height="70%" color="#f8e71c" fill="none">
                                                <path d="M11.5384 7.2534C11.7534 6.91553 12.2466 6.91553 12.4616 7.2534L13.0837 8.23082C13.7716 9.3117 14.6883 10.2284 15.7692 10.9163L16.7466 11.5384C17.0845 11.7534 17.0845 12.2466 16.7466 12.4616L15.7692 13.0837C14.6883 13.7716 13.7716 14.6883 13.0837 15.7692L12.4616 16.7466C12.2466 17.0845 11.7534 17.0845 11.5384 16.7466L10.9163 15.7692C10.2284 14.6883 9.3117 13.7716 8.23082 13.0837L7.2534 12.4616C6.91553 12.2466 6.91553 11.7534 7.2534 11.5384L8.23082 10.9163C9.3117 10.2284 10.2284 9.3117 10.9163 8.23082L11.5384 7.2534Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                                            </svg>
                                        </CardTitle>
                                        <CardDescription>349 tokens</CardDescription>
                                    </CardHeader>
                                    <Button className='w-full h-6' variant="secondary"
                                        // onClick={() => onCheckOut(price.basic, 1)} 
                                        onClick={() => setSelectedOption(price.basic)}
                                        disabled={!!submitting}>
                                        {submitting === 1 ? (
                                            <Spinner />
                                        ) : (
                                            <p>$0.50</p>
                                        )}
                                    </Button>
                                </Card>
                                <Card className='h-40 w-32 mb-2'>
                                    <CardHeader>
                                        <CardTitle>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="70%" height="70%" color="#f8e71c" fill="none">
                                                <path d="M14 18C18.4183 18 22 14.4183 22 10C22 5.58172 18.4183 2 14 2C9.58172 2 6 5.58172 6 10C6 14.4183 9.58172 18 14 18Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                                <path d="M3.15657 11C2.42523 12.1176 2 13.4535 2 14.8888C2 18.8162 5.18378 22 9.11116 22C10.5465 22 11.8824 21.5748 13 20.8434" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                                <path d="M15.7712 8.20524C15.555 7.29311 14.4546 6.47004 13.1337 7.08579C11.8128 7.70154 11.603 9.68269 13.601 9.89315C14.5041 9.98828 15.0928 9.78277 15.6319 10.3641C16.1709 10.9454 16.2711 12.562 14.8931 12.9977C13.5151 13.4334 12.1506 12.7526 12.002 11.786M13.9862 6.00421V6.87325M13.9862 13.1318V14.0042" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </CardTitle>
                                        <CardDescription>1047 tokens</CardDescription>
                                    </CardHeader>
                                    <Button className='w-full h-6' variant="secondary" onClick={() => setSelectedOption(price.basic2)} disabled={!!submitting}>
                                        {submitting === 2 ? (
                                            <Spinner />
                                        ) : (
                                            <p>$0.80</p>
                                        )}
                                    </Button>
                                </Card>
                                <Card className='h-40 w-32 mb-2'>
                                    <CardHeader>
                                        <CardTitle>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="70%" height="70%" color="#f8e71c" fill="none">
                                                <path d="M21.5 11.0288C21.8239 11.8026 22 12.6342 22 13.5C22 15.5586 21.0047 17.4235 19.3933 18.7788C19.1517 18.982 19 19.2762 19 19.5919V22H17L16.2062 20.8674C16.083 20.6916 15.8616 20.6153 15.6537 20.6687C13.9248 21.1132 12.0752 21.1132 10.3463 20.6687C10.1384 20.6153 9.91703 20.6916 9.79384 20.8674L9 22H7V19.6154C7 19.2866 6.83835 18.9788 6.56764 18.7922C5.49285 18.0511 2 16.6014 2 15.0582V13.5C2 12.9083 2.44771 12.4286 3 12.4286C3.60665 12.4286 4.10188 12.1929 4.30205 11.5661C5.06912 9.16411 7.23085 7.23604 10.0206 6.42073" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M14.125 9.5L14.125 3.5M16 3.5V2M16 11V9.5M14.125 6.5H17.875M17.875 6.5C18.4963 6.5 19 7.00368 19 7.625V8.375C19 8.99632 18.4963 9.5 17.875 9.5H13M17.875 6.5C18.4963 6.5 19 5.99632 19 5.375V4.625C19 4.00368 18.4963 3.5 17.875 3.5H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M7.49981 12H7.50879" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </CardTitle>
                                        <CardDescription>1745 tokens</CardDescription>
                                    </CardHeader>
                                    <Button className='w-full h-6' variant="secondary" onClick={() => setSelectedOption(price.medium)} disabled={!!submitting}>
                                        {submitting === 3 ? (
                                            <Spinner />
                                        ) : (
                                            <p>$1.39</p>
                                        )}
                                    </Button>
                                </Card>

                                <Card className='h-40 w-32 mb-2'>
                                    <CardHeader>
                                        <CardTitle>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="70%" height="70%" color="#f8e71c" fill="none">
                                                <ellipse cx="15.5" cy="11" rx="6.5" ry="2" stroke="currentColor" stroke-width="1.5" />
                                                <path d="M22 15.5C22 16.6046 19.0899 17.5 15.5 17.5C11.9101 17.5 9 16.6046 9 15.5" stroke="currentColor" stroke-width="1.5" />
                                                <path d="M22 11V19.8C22 21.015 19.0899 22 15.5 22C11.9101 22 9 21.015 9 19.8V11" stroke="currentColor" stroke-width="1.5" />
                                                <ellipse cx="8.5" cy="4" rx="6.5" ry="2" stroke="currentColor" stroke-width="1.5" />
                                                <path d="M6 11C4.10819 10.7698 2.36991 10.1745 2 9M6 16C4.10819 15.7698 2.36991 15.1745 2 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                                <path d="M6 21C4.10819 20.7698 2.36991 20.1745 2 19L2 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                                <path d="M15 6V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                            </svg>
                                        </CardTitle>
                                        <CardDescription>2792 tokens</CardDescription>
                                    </CardHeader>
                                    <Button className='w-full h-6' variant="secondary" onClick={() => setSelectedOption(price.medium2)} disabled={!!submitting}>
                                        {submitting === 4 ? (
                                            <Spinner />
                                        ) : (
                                            <p>$2.30</p>
                                        )}
                                    </Button>
                                </Card>
                                <Card className='h-40 w-32 mb-2'>
                                    <CardHeader>
                                        <CardTitle>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="70%" height="70%" color="#f8e71c" fill="none">
                                                <path d="M20.9427 16.8354C20.2864 12.8866 18.2432 9.94613 16.467 8.219C15.9501 7.71642 15.6917 7.46513 15.1208 7.23257C14.5499 7 14.0592 7 13.0778 7H10.9222C9.94081 7 9.4501 7 8.87922 7.23257C8.30834 7.46513 8.04991 7.71642 7.53304 8.219C5.75682 9.94613 3.71361 12.8866 3.05727 16.8354C2.56893 19.7734 5.27927 22 8.30832 22H15.6917C18.7207 22 21.4311 19.7734 20.9427 16.8354Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                                <path d="M7.25662 4.44287C7.05031 4.14258 6.75128 3.73499 7.36899 3.64205C8.00392 3.54651 8.66321 3.98114 9.30855 3.97221C9.89237 3.96413 10.1898 3.70519 10.5089 3.33548C10.8449 2.94617 11.3652 2 12 2C12.6348 2 13.1551 2.94617 13.4911 3.33548C13.8102 3.70519 14.1076 3.96413 14.6914 3.97221C15.3368 3.98114 15.9961 3.54651 16.631 3.64205C17.2487 3.73499 16.9497 4.14258 16.7434 4.44287L15.8105 5.80064C15.4115 6.38146 15.212 6.67187 14.7944 6.83594C14.3769 7 13.8373 7 12.7582 7H11.2418C10.1627 7 9.6231 7 9.20556 6.83594C8.78802 6.67187 8.5885 6.38146 8.18945 5.80064L7.25662 4.44287Z" stroke="currentColor" stroke-width="1.5" />
                                            </svg>
                                        </CardTitle>
                                        <CardDescription>4188 tokens</CardDescription>
                                    </CardHeader>
                                    <Button className='w-full h-6' variant="secondary" onClick={() => setSelectedOption(price.large)} disabled={!!submitting}>
                                        {submitting === 5 ? (
                                            <Spinner />
                                        ) : (
                                            <p>$3.46</p>
                                        )}
                                    </Button>
                                </Card>
                                <Card className='h-40 w-32 mb-2'>
                                    <CardHeader>
                                        <CardTitle>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="70%" height="70%" color="#f8e71c" fill="none">
                                                <path d="M4 11V15C4 18.2998 4 19.9497 5.02513 20.9749C6.05025 22 7.70017 22 11 22H13C16.2998 22 17.9497 22 18.9749 20.9749C20 19.9497 20 18.2998 20 15V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M3 9C3 8.25231 3 7.87846 3.20096 7.6C3.33261 7.41758 3.52197 7.26609 3.75 7.16077C4.09808 7 4.56538 7 5.5 7H18.5C19.4346 7 19.9019 7 20.25 7.16077C20.478 7.26609 20.6674 7.41758 20.799 7.6C21 7.87846 21 8.25231 21 9C21 9.74769 21 10.1215 20.799 10.4C20.6674 10.5824 20.478 10.7339 20.25 10.8392C19.9019 11 19.4346 11 18.5 11H5.5C4.56538 11 4.09808 11 3.75 10.8392C3.52197 10.7339 3.33261 10.5824 3.20096 10.4C3 10.1215 3 9.74769 3 9Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                                                <path d="M6 3.78571C6 2.79949 6.79949 2 7.78571 2H8.14286C10.2731 2 12 3.7269 12 5.85714V7H9.21429C7.43908 7 6 5.56091 6 3.78571Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                                                <path d="M18 3.78571C18 2.79949 17.2005 2 16.2143 2H15.8571C13.7269 2 12 3.7269 12 5.85714V7H14.7857C16.5609 7 18 5.56091 18 3.78571Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                                                <path d="M12 11L12 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </CardTitle>
                                        <CardDescription>5235 tokens</CardDescription>
                                    </CardHeader>
                                    <Button className='w-full h-6' variant="secondary" onClick={() => setSelectedOption(price.premium)} disabled={!!submitting}>
                                        {submitting === 6 ? (
                                            <Spinner />
                                        ) : (
                                            <p>$4.33</p>
                                        )}
                                    </Button>
                                </Card>

                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>

            {selectedOption && (
                <div>
                    <Dialog
                        open={!!selectedOption}
                        onOpenChange={() => setSelectedOption(null)}
                    >
                        <DialogTrigger>
                            <button className='bg-[#9981f9] w-full h-7 rounded-md'>Pay with PayPal</button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Pay with PayPal</DialogTitle>
                            </DialogHeader>
                            <DialogDescription>
                                <PayPalButtons
                                    style={{ layout: "horizontal" }}
                                    createOrder={(data, actions) => {
                                        return actions.order.create({
                                            intent: "CAPTURE",
                                            purchase_units: [
                                                {
                                                    amount: {
                                                        value: selectedOption.toString(),
                                                        currency_code: 'USD',
                                                    },
                                                },
                                            ],
                                        });
                                    }}
                                    onApprove={async () => {
                                        onPaymentSuccess();
                                    }}
                                    onCancel={() => setSelectedOption(null)}
                                />
                            </DialogDescription>
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        </PayPalScriptProvider>
    )
}

export default UsageTrack