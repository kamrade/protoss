import { Button } from "@/components/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog";
import { TextField } from "@/components/TextField";

export function DialogShowcase() {
  return (
    <section className="flex flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
          Component
        </p>
        <h2 className="text-3xl font-semibold text-gray-900">Dialog</h2>
        <p className="mt-2 text-sm text-gray-600">
          Layered overlays for confirmations and focused forms. Built on Radix
          dialog primitives with composable subcomponents.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900">Form surface</h3>
        <p className="mt-1 text-sm text-gray-600">
          Compose our TextField and Button primitives inside Dialog content for
          quick flows.
        </p>
        <div className="mt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Invite collaborator</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite collaborator</DialogTitle>
                <DialogDescription>
                  Send a one-time invite for this workspace. Slack and email
                  notifications will be dispatched.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <TextField label="Full name" placeholder="Ariana Patel" />
                <TextField
                  label="Work email"
                  placeholder="user@workspace.com"
                  description="Members inherit the default reviewer role."
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <Button>Send invite</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900">Confirmation</h3>
        <p className="mt-1 text-sm text-gray-600">
          Use slot-based triggers and custom button variants for destructive
          flows.
        </p>
        <div className="mt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Disable payouts</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Disable payouts?</DialogTitle>
                <DialogDescription>
                  This pauses all outbound transfers until re-enabled. Scheduled
                  payments will be cancelled.
                </DialogDescription>
              </DialogHeader>
              <p className="text-sm text-gray-600">
                You can re-enable payouts in settings at any time. Only admins
                receive notifications about this change.
              </p>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Keep payouts</Button>
                </DialogClose>
                <Button className="bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600">
                  Disable payouts
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}
