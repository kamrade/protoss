import { Button } from "@/components/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/Dialog";

interface AddCorporateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section: string;
}

export function AddCorporate({ open, onOpenChange, section }: AddCorporateProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Corporate</DialogTitle>
          <DialogDescription>
            Create a corporate entity record for the {section.toLowerCase()} section.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-gray-600">
          Use this dialog to gather company-level documentation, addresses, and
          ownership data. Replace this placeholder copy with your form.
        </p>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button>Add corporate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
