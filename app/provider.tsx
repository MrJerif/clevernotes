// "use client";

// import { ReactNode } from "react";
// import {
//   LiveblocksProvider,
//   RoomProvider,
//   ClientSideSuspense,
// } from "@liveblocks/react/suspense";
// import { Spinner } from "@/components/spinner";

// export function Provider({ children }: { children: ReactNode }) {
//   return (
//     <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
//       <RoomProvider id="my-room">
//         <ClientSideSuspense fallback={<div><Spinner /></div>}>
//           {children}
//         </ClientSideSuspense>
//       </RoomProvider>
//     </LiveblocksProvider>
//   );
// }