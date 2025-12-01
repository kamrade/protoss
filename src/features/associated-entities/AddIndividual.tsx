import { Button } from "@/components/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/Dialog";

interface AddIndividualProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section: string;
}

export function AddIndividual({ open, onOpenChange, section }: AddIndividualProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Individual</DialogTitle>
          <DialogDescription>
            Create an individual record for the {section.toLowerCase()} section.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-gray-600">
          This is a placeholder surface. Hook up form fields for identity,
          ownership, and compliance requirements here.
        </p>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button>Add individual</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
