import "server-only";
import { accountRouter } from "@/server/routers/account";
import { adminRouter } from "@/server/routers/admin";
import { bookingRouter } from "@/server/routers/booking";
import { listingRouter } from "@/server/routers/listing";
import { router } from "@/server/trpc";

export const appRouter = router({ listing: listingRouter, booking: bookingRouter, account: accountRouter, admin: adminRouter });

export type AppRouter = typeof appRouter;
