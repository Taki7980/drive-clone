"use client"

import { useState, useEffect } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { FolderIcon, FileIcon, Upload, Home, Clock, Star, Trash, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"

// Add these interfaces at the top of the file after the imports
interface FileItem {
  type: "file"
  name: string
  link: string
}

interface FolderItem {
  type: "folder"
  name: string
  contents: (FileItem | FolderItem)[]
}

const mockData: { root: (FileItem | FolderItem)[] } = {
  root: [
    {
      type: "folder",
      name: "Documents",
      contents: [
        { type: "file", name: "Resume.pdf", link: "#" },
        { type: "file", name: "Cover Letter.docx", link: "#" },
      ],
    },
    {
      type: "folder",
      name: "Images",
      contents: [
        { type: "file", name: "Vacation.jpg", link: "#" },
        { type: "file", name: "Family.png", link: "#" },
      ],
    },
    { type: "file", name: "Project Plan.xlsx", link: "#" },
    { type: "file", name: "Meeting Notes.txt", link: "#" },
  ],
}

export default function GoogleDriveClone() {
  const [currentFolder, setCurrentFolder] = useState<string>("root")
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>(["My Drive"])
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const openFolder = (folderName: string) => {
    setCurrentFolder(folderName)
    setBreadcrumbs([...breadcrumbs, folderName])
  }

  const goBack = () => {
    if (breadcrumbs.length > 1) {
      const newBreadcrumbs = breadcrumbs.slice(0, -1)
      setBreadcrumbs(newBreadcrumbs)
      setCurrentFolder(
        newBreadcrumbs[newBreadcrumbs.length - 1] === "My Drive" ? "root" : newBreadcrumbs[newBreadcrumbs.length - 1] ?? "root",
      )
    }
  }

  const renderContents = (contents: (FileItem | FolderItem)[]) => {
    return contents.map((item, index) => (
      <div
        key={index}
        className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
      >
        {item.type === "folder" ? (
          <div onClick={() => openFolder(item.name)} className="flex items-center">
            <FolderIcon className="w-5 h-5 mr-2 text-blue-500" />
            <span>{item.name}</span>
          </div>
        ) : (
          <a href={item.link} className="flex items-center">
            <FileIcon className="w-5 h-5 mr-2 text-gray-500" />
            <span>{item.name}</span>
          </a>
        )}
      </div>
    ))
  }

  if (!mounted) return null

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 dark:bg-gray-800 p-4 border-r border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Image src="/placeholder.svg?height=40&width=40" alt="Google Drive" className="w-10 h-10 mr-2" width={40} height={40} />
            <span className="text-xl font-semibold">Google Drive</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="ml-2"
          >
            {mounted && (theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
          </Button>
        </div>
        <Button className="w-full mb-4" onClick={() => alert("Upload functionality not implemented in this demo.")}>
          <Upload className="w-4 h-4 mr-2" />
          New
        </Button>
        <nav>
          <ul className="space-y-2">
            <li>
              <Button variant="ghost" className="w-full justify-start">
                <Home className="w-4 h-4 mr-2" /> My Drive
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                <Clock className="w-4 h-4 mr-2" /> Recent
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                <Star className="w-4 h-4 mr-2" /> Starred
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                <Trash className="w-4 h-4 mr-2" /> Trash
              </Button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="mb-4">
          <Input type="text" placeholder="Search in Drive" className="w-full max-w-md" />
        </div>
        <div className="mb-4">
          <Button variant="ghost" onClick={goBack} disabled={breadcrumbs.length === 1}>
            Back
          </Button>
          <span className="ml-2">{breadcrumbs.join(" > ")}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {renderContents(
            currentFolder === "root"
              ? mockData.root
              : (mockData.root.find((f): f is FolderItem => f.name === currentFolder && f.type === "folder")?.contents ?? [])
          )}
        </div>
      </div>
    </div>
  )
}

