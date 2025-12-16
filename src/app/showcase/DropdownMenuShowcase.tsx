import { Button } from "@/components/Button";
import { IconButton } from "@/components/IconButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/DropdownMenu";
import {
  DotsHorizontalIcon,
  ExitIcon,
  GearIcon,
  MixIcon,
  PlusCircledIcon,
  Share2Icon,
} from "@radix-ui/react-icons";

const primaryItems = [
  { title: "Invite member", icon: PlusCircledIcon, shortcut: "⌘ I" },
  { title: "Share profile", icon: Share2Icon, shortcut: "⌘ S" },
  { title: "Automations", icon: MixIcon, shortcut: "⌘ A" },
] as const;

const secondaryItems = [
  { title: "Workspace settings", icon: GearIcon, destructive: false },
  { title: "Logout", icon: ExitIcon, destructive: true },
] as const;

export function DropdownMenuShowcase() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
            Component
          </p>
          <h2 className="text-3xl font-semibold text-gray-900">Dropdown Menu</h2>
          <p className="mt-2 text-sm text-gray-600">
            Contextual command menu activated from any trigger. Built with Radix
            dropdown primitives and styled via Tailwind.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900">Button trigger</h3>
        <p className="mt-1 text-sm text-gray-600">
          Use the standard Button component and enable <code>asChild</code> on
          the trigger for consistent spacing.
        </p>
        <div className="mt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>Command menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
              {primaryItems.map(({ title, icon: Icon, shortcut }) => (
                <DropdownMenuItem key={title}>
                  <span className="inline-flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {title}
                  </span>
                  <DropdownMenuShortcut>{shortcut}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              {secondaryItems.map(({ title, icon: Icon, destructive }) => (
                <DropdownMenuItem
                  key={title}
                  className={destructive ? "text-red-600 focus:bg-red-50" : ""}
                >
                  <span className="inline-flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {title}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900">Icon trigger</h3>
        <p className="mt-1 text-sm text-gray-600">
          Icon buttons keep surfaces clean on dense tables or cards.
        </p>
        <div className="mt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton aria-label="Show options">
                <DotsHorizontalIcon />
              </IconButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuItem>Rename</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 focus:bg-red-50">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </section>
  );
}
