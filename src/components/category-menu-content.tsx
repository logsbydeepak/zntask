import {
  ArchiveRestoreIcon,
  EditIcon,
  HeartIcon,
  HeartOffIcon,
  Trash2Icon,
} from "lucide-react"

import {
  ContextMenuItem,
  DropdownMenuItem,
  MenuIcon,
} from "#/components/ui/menu"
import { useAppStore } from "#/store/app"
import { Category, categoryHelper } from "#/utils/category"

export function CategoryMenuContent({
  category,
  type,
}: {
  category: Category
  type: "context" | "dropdown"
}) {
  const setDialog = useAppStore((s) => s.setDialog)
  const toggleArchive = useAppStore((s) => s.toggleArchive)
  const toggleFavorite = useAppStore((s) => s.toggleFavorite)

  const isFavorite = categoryHelper.is.favorite(category)
  const isArchived = categoryHelper.is.archived(category)

  const menuItem = [
    {
      label: "Edit",
      onSelect: () => setDialog({ editCategory: category.id }),
      icon: <EditIcon />,
    },

    {
      label: !!isFavorite ? "Unfavorite" : "Favorite",
      onSelect: () => toggleFavorite(category),
      icon: !!isFavorite ? <HeartOffIcon /> : <HeartIcon />,
    },

    {
      label: isArchived ? "Unarchive" : "Archive",
      onSelect: () => toggleArchive(category),
      icon: isArchived ? <ArchiveRestoreIcon /> : <ArchiveRestoreIcon />,
    },
    {
      label: "Delete",
      onSelect: () => setDialog({ deleteCategory: category.id }),
      icon: <Trash2Icon />,
      intent: "destructive" as const,
    },
  ]

  if (isArchived) {
    menuItem.splice(1, 1)
  }

  if (type === "context") {
    return menuItem.map((i) => (
      <ContextMenuItem key={i.label} onSelect={i.onSelect} intent={i.intent}>
        <MenuIcon intent={i.intent}>{i.icon}</MenuIcon>
        <span>{i.label}</span>
      </ContextMenuItem>
    ))
  }

  return menuItem.map((i) => (
    <DropdownMenuItem key={i.label} onSelect={i.onSelect} intent={i.intent}>
      <MenuIcon intent={i.intent}>{i.icon}</MenuIcon>
      <span>{i.label}</span>
    </DropdownMenuItem>
  ))
}
