import React from "react"
import { useRouter } from "next/navigation"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import { Command } from "cmdk"
import {
  ArchiveIcon,
  CalendarClockIcon,
  CheckCircleIcon,
  FolderArchive,
  FolderIcon,
  FolderPlusIcon,
  FolderSearchIcon,
  GanttChartIcon,
  HeartIcon,
  InboxIcon,
  PlusIcon,
  ScanSearchIcon,
  SearchIcon,
  SidebarIcon,
} from "lucide-react"

import {
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
} from "#/components/ui/dialog"
import { useAppStore } from "#/store/app"
import { categoryHelper, getCategoryColor } from "#/utils/category"
import { cn } from "#/utils/style"

export function CommandPaletteDialog() {
  const isOpen = useAppStore((s) => s.dialog.commandPalette)
  const setDialog = useAppStore((s) => s.setDialog)

  const handleClose = () => {
    setDialog({ commandPalette: false })
  }

  return (
    <DialogRoot open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="p-0 sm:p-0">
        <VisuallyHidden.Root>
          <DialogTitle>Command palette</DialogTitle>
          <DialogDescription>Command palette</DialogDescription>
        </VisuallyHidden.Root>
        <CommandPaletteContent handleClose={handleClose} />
      </DialogContent>
    </DialogRoot>
  )
}

type Page =
  | "SEARCH_ACTIVE_CATEGORY"
  | "SEARCH_ARCHIVE_CATEGORY"
  | "SEARCH_ALL_CATEGORY"
  | "SEARCH_TASK"
function CommandPaletteContent({ handleClose }: { handleClose: () => void }) {
  const [search, setSearch] = React.useState("")
  const [pages, setPages] = React.useState<string[]>([])
  const page = pages[pages.length - 1] as Page | undefined

  const router = useRouter()
  const setDialog = useAppStore((s) => s.setDialog)
  const toggleSidebar = useAppStore((s) => s.toggleSidebar)

  const activeCategory = useAppStore((s) =>
    categoryHelper.getActiveCategories(s.categories)
  )
  const archiveCategory = useAppStore((s) =>
    categoryHelper.getArchivedCategories(s.categories)
  )
  const categories = useAppStore((s) => s.categories)
  const parentTask = useAppStore((s) => s.parentTasks)
  const childTasks = useAppStore((s) => s.childTasks)

  const changePage = React.useCallback((page: Page) => {
    setPages((i) => [...i, page])
  }, [])

  const pagesGroups = [
    {
      label: "today",
      icon: <CalendarClockIcon />,
      onSelect: () => {
        router.push("/today")
        handleClose()
      },
    },
    {
      label: "upcoming",
      icon: <GanttChartIcon />,
      onSelect: () => {
        router.push("/upcoming")

        handleClose()
      },
    },
    {
      label: "inbox",
      icon: <InboxIcon />,
      onSelect: () => {
        router.push("/inbox")
        handleClose()
      },
    },
    {
      label: "favorite",
      icon: <HeartIcon />,
      onSelect: () => {
        router.push("/favorite")
        handleClose()
      },
    },
    {
      label: "active category",
      icon: <FolderIcon />,
      onSelect: () => {
        router.push("/category")
        handleClose()
      },
    },
    {
      label: "archive category",
      icon: <FolderArchive />,
      onSelect: () => {
        router.push("/category?status=archive")
        handleClose()
      },
    },
  ]

  const actionsGroup = [
    {
      label: "new task",
      icon: <PlusIcon />,
      onSelect: () => {
        setDialog({ createTask: true })
        handleClose()
      },
    },
    {
      label: "new category",
      icon: <FolderPlusIcon />,
      onSelect: () => {
        setDialog({ createCategory: true })
        handleClose()
      },
    },
    {
      label: "toggle sidebar",
      icon: <SidebarIcon />,
      onSelect: () => toggleSidebar(),
    },
  ]

  const searchGroups = [
    {
      label: "active category",
      icon: <FolderSearchIcon />,
      onSelect: () => {
        changePage("SEARCH_ACTIVE_CATEGORY")
        setSearch("")
      },
    },
    {
      label: "archive category",
      icon: <ArchiveIcon />,
      onSelect: () => {
        changePage("SEARCH_ARCHIVE_CATEGORY")
        setSearch("")
      },
    },
    {
      label: "all category",
      icon: <ScanSearchIcon />,
      onSelect: () => {
        changePage("SEARCH_ALL_CATEGORY")
        setSearch("")
      },
    },

    {
      label: "task",
      icon: <CheckCircleIcon />,
      onSelect: () => {
        changePage("SEARCH_TASK")
        setSearch("")
      },
    },
  ]

  React.useEffect(() => {
    const el = document.querySelector("[cmdk-list-sizer]")
    el?.scrollTo({ top: 0 })
  }, [search])

  return (
    <>
      <Command
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            if (pages.length !== 0) {
              e.preventDefault()
              setPages((pages) => pages.slice(0, -1))
            }
          }
        }}
      >
        <div className="flex items-center border-b border-gray-3 p-3">
          <SearchIcon className="size-3 text-gray-10" />
          <Command.Input
            value={search}
            placeholder="search"
            onValueChange={setSearch}
            autoFocus
            className="ml-2 h-5 w-full border-none p-0 outline-none placeholder:text-gray-10 focus:ring-0"
          />
        </div>
        <Command.List className="[&>[cmdk-list-sizer]]:ml-2 [&>[cmdk-list-sizer]]:h-60 [&>[cmdk-list-sizer]]:space-y-2 [&>[cmdk-list-sizer]]:overflow-y-scroll [&>[cmdk-list-sizer]]:py-2 [&>[cmdk-list-sizer]]:pr-1">
          <Command.Empty className="flex h-[calc(100%-5%)] items-center justify-center">
            <div className="flex flex-col items-center justify-center space-y-1 rounded-md border p-4 shadow-sm">
              <span className="inline-block size-5">
                <SearchIcon />
              </span>
              <p className="text-xs text-gray-11">not result</p>
            </div>
          </Command.Empty>
          {!page && (
            <>
              <CommandItem.Group heading="Pages">
                {pagesGroups.map((i) => (
                  <CommandItem.Container
                    key={i.label}
                    onSelect={i.onSelect}
                    value={`pages ${i.label}`}
                  >
                    <CommandItem.Icon>{i.icon}</CommandItem.Icon>
                    <CommandItem.Title>{i.label}</CommandItem.Title>
                  </CommandItem.Container>
                ))}
              </CommandItem.Group>

              <CommandItem.Group heading="Search">
                {searchGroups.map((i) => (
                  <CommandItem.Container
                    key={i.label}
                    onSelect={i.onSelect}
                    value={`search ${i.label}`}
                  >
                    <CommandItem.Icon>{i.icon}</CommandItem.Icon>
                    <CommandItem.Title>{i.label}</CommandItem.Title>
                  </CommandItem.Container>
                ))}
              </CommandItem.Group>

              <CommandItem.Group heading="Actions">
                {actionsGroup.map((i) => (
                  <CommandItem.Container
                    key={i.label}
                    onSelect={i.onSelect}
                    value={`actions ${i.label}`}
                  >
                    <CommandItem.Icon>{i.icon}</CommandItem.Icon>
                    <CommandItem.Title>{i.label}</CommandItem.Title>
                  </CommandItem.Container>
                ))}
              </CommandItem.Group>
            </>
          )}

          {page === "SEARCH_ACTIVE_CATEGORY" && (
            <>
              {activeCategory.map((i) => (
                <CommandItem.Container
                  value={`${i.title} ${i.id}`}
                  key={i.id}
                  onSelect={() => {
                    router.push(`/category/${i.id}`)
                    handleClose()
                  }}
                >
                  <CommandItem.Icon>
                    <div
                      className={cn(
                        "size-2.5 rounded-[4px]",
                        getCategoryColor(i.indicator, "bg")
                      )}
                    />
                  </CommandItem.Icon>

                  <CommandItem.Title>{i.title}</CommandItem.Title>
                </CommandItem.Container>
              ))}
            </>
          )}

          {page === "SEARCH_ARCHIVE_CATEGORY" && (
            <>
              {archiveCategory.map((i) => (
                <CommandItem.Container
                  value={`${i.title} ${i.id}`}
                  key={i.id}
                  onSelect={() => {
                    router.push(`/category/${i.id}`)
                    handleClose()
                  }}
                >
                  <CommandItem.Icon>
                    <div
                      className={cn(
                        "size-2.5 rounded-[4px]",
                        getCategoryColor(i.indicator, "bg")
                      )}
                    />
                  </CommandItem.Icon>

                  <CommandItem.Title>{i.title}</CommandItem.Title>
                </CommandItem.Container>
              ))}
            </>
          )}

          {page === "SEARCH_ALL_CATEGORY" && (
            <>
              {categories.map((i) => (
                <CommandItem.Container
                  value={`${i.title} ${i.id}`}
                  key={i.id}
                  onSelect={() => {
                    router.push(`/category/${i.id}`)
                    handleClose()
                  }}
                >
                  <CommandItem.Icon>
                    <div
                      className={cn(
                        "size-2.5 rounded-[4px]",
                        getCategoryColor(i.indicator, "bg")
                      )}
                    />
                  </CommandItem.Icon>

                  <CommandItem.Title>{i.title}</CommandItem.Title>
                </CommandItem.Container>
              ))}
            </>
          )}
          {page === "SEARCH_TASK" && (
            <>
              {parentTask.map((i) => (
                <CommandItem.Container
                  value={`${i.title} ${i.id}`}
                  key={i.id}
                  onSelect={() => {
                    setDialog({ editTask: { parentTaskId: i.id } })
                    handleClose()
                  }}
                >
                  <CommandItem.Title>{i.title}</CommandItem.Title>
                </CommandItem.Container>
              ))}

              {childTasks.map((i) => (
                <CommandItem.Container
                  value={`${i.title} ${i.id}`}
                  key={i.id}
                  onSelect={() => {
                    setDialog({ editTask: { childTaskId: i.id } })
                    handleClose()
                  }}
                >
                  <CommandItem.Title>{i.title}</CommandItem.Title>
                </CommandItem.Container>
              ))}
            </>
          )}
        </Command.List>
      </Command>
    </>
  )
}

const CommandItemContainer = React.forwardRef<
  React.ElementRef<typeof Command.Item>,
  React.ComponentPropsWithoutRef<typeof Command.Item>
>(({ ...props }, ref) => {
  return (
    <Command.Item
      ref={ref}
      {...props}
      className="group/item my-0.5 flex cursor-pointer items-center rounded-lg border border-transparent px-3 py-2 data-[selected=true]:border-gray-12/5 data-[selected=true]:bg-gray-3/50"
    />
  )
})
CommandItemContainer.displayName = Command.Item.displayName

const CommandItemGroup = React.forwardRef<
  React.ElementRef<typeof Command.Group>,
  React.ComponentPropsWithoutRef<typeof Command.Group>
>(({ ...props }, ref) => {
  return (
    <Command.Group
      ref={ref}
      {...props}
      className="space-y-1 text-xs font-medium text-gray-10 [&>[cmdk-group-heading]]:px-2"
    />
  )
})
CommandItemGroup.displayName = Command.Group.displayName

function CommandItemIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="mr-2 flex size-4 items-center justify-center border border-transparent text-gray-11 group-data-[selected=true]/item:text-gray-12">
      {children}
    </div>
  )
}

function CommandItemTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="truncate text-sm font-normal text-gray-11 group-data-[selected=true]/item:text-gray-12">
      {children}
    </p>
  )
}

const CommandItem = {
  Container: CommandItemContainer,
  Icon: CommandItemIcon,
  Title: CommandItemTitle,
  Group: CommandItemGroup,
}
