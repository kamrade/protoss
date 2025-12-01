import { IconButton } from "@/components/IconButton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/DropdownMenu";
import { PlusIcon } from "@radix-ui/react-icons";

const entitySections = [
  {
    title: "Shareholders",
    options: ["Individual", "Corporate"],
  },
  {
    title: "Directors",
    options: ["Individual"],
  },
  {
    title: "Authorised Signatories",
    options: ["Individual"],
  },
  {
    title: "Users",
    options: ["Individual"],
  },
] as const;

export default function AssociatedEntitiesPage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-16">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-semibold text-gray-900">
          Associated Entities
        </h1>
        <p className="text-sm text-gray-600">
          Centralized records for every partner connected to this workspace.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {entitySections.map(({ title, options }) => (
          <section
            key={title}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <IconButton aria-label={`Add ${title}`}>
                    <PlusIcon />
                  </IconButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {options.map((option) => (
                    <DropdownMenuItem key={option}>{option}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              No records yet. Use the add button to create the first entry.
            </p>
          </section>
        ))}
      </div>
    </main>
  );
}
