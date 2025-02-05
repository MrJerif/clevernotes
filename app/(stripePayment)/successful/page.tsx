// "use client";

// import { Spinner } from '@/components/spinner'
// // import { api } from '@/convex/_generated/api';
// // import { useUser } from '@clerk/clerk-react';
// // import { useMutation, useQuery } from 'convex/react';
// import { CheckCircle } from 'lucide-react'
// // import Image from 'next/image'
// import { useRouter } from 'next/navigation';
// import React, { useEffect } from 'react'
// import { toast } from 'sonner';

// const PaymentSuccess = () => {
//   // const { user } = useUser();
//   const router = useRouter();

//   // Tokens
//   // const [userTokens, setUserTokens] = useState<number>();
//   // const getTokens = useQuery(api.documents.getTokens);
//   // const buyTokens = useMutation(api.documents.buyTokens);

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const referrer = sessionStorage.getItem('referrer');
//     const redirectTo = referrer || "/documents";

//     if(!params.get("payment") || params.get("payment") !== "success") {
//       router.push(redirectTo)
//       return;
//     }

//     toast.success("Tokens added successfully! 🥳")
//     setTimeout(() => {
//       router.push(redirectTo);
//     }, 3500);

//   }, [router]);

//   return (
//     <div className='m-auto flex flex-col items-center gap-3'>
//       {/* <Image 
//         src="/paymentsuccess.png"
//         height={200}
//         width={200}
//         alt='Payment Success'
//         className='mt-8 rounded-lg'
//       /> */}
//         <div className='font-extrabold text-3xl mt-[30vh]'>
//           <CheckCircle width="60" height="60" fill='green'/>
//           Payment Successful!
//         </div>
//         <div>
//           {/* Your payment of <span className='font-semibold text-lg'>$4.99</span> for <span className='font-semibold text-lg'>4321</span> tokens was Successful! */}
//           Your Payment was Successful!
//         </div>
//         <Spinner />
//     </div>
//   )
// }

// export default PaymentSuccess