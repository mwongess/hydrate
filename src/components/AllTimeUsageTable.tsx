"use client"

import * as React from "react"
import { BiTrash } from "react-icons/bi";
import { useRouter } from 'next/navigation';
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { appwriteService } from "@/appwrite/config";
import { FaCopy, FaRegBell, FaUserEdit } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";


export function AllTimeUsageTable({ data }: any) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const router = useRouter()
    const columns: ColumnDef<any>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    className="border border-slate-200"
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    className="border border-slate-200"
                    checked={row.getIsSelected()}
                    onCheckedChange={(value: any) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "clientID",
            header: "Client ID",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("clientID")}</div>
            ),
        },
        {
            accessorKey: "month",
            header: "Billing Month",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("month")}</div>
            ),
        },
        {
            accessorKey: "initialReading",
            header: ({ column }) => {
                return (
                    <p
                        className="flex"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Initial Reading
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </p>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("initialReading")}</div>,
        },
        {
            accessorKey: "finalReading",
            header: ({ column }) => {
                return (
                    <p
                        className=" flex"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Final Reading
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </p>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("finalReading")}</div>,
        },
        {
            accessorKey: "consumedUnits",
            header: ({ column }) => {
                return (
                    <p
                        className="flex"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Consumed Units
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </p>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("consumedUnits")}</div>,
        },
        {
            accessorKey: "total",
            header: ({ column }) => {
                return (
                    <p
                        className="flex"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Total
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </p>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("total")}</div>,
        },
        {
            accessorKey: "paid",
            header: ({ column }) => {
                return (
                    <p
                        className="flex"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Paid
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </p>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("paid")}</div>,
        },
        {
            accessorKey: "balance",
            header: ({ column }) => {
                return (
                    <p
                        className="flex"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Balance
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </p>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("balance")}</div>,
        },
        {
            accessorKey: "caForward",
            header: ({ column }) => {
                return (
                    <p
                        className="flex"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Carried Forward
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </p>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("caForward")}</div>,
        },
        {
            accessorKey: "cumulativeTotal",
            header: () => <div className="text-right">Cumulative Total</div>,
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("cumulativeTotal"))

                const formatted = new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "ksh",
                }).format(amount)

                return <div className="text-right font-medium">{formatted}</div>
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const client = row.original

                return (
                    <DropdownMenu >
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-black  text-white rounded border border-slate-200">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <p onClick={() => { router.push(`/console/clients/${client.clientID}/usage`) }} className="flex items-center gap-2  text-base cursor-pointer">
                                    <AiOutlineEye />
                                    View Client Details</p>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]
    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="w-full text-slate-200">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter Data By Month..."
                    value={(table.getColumn("month")?.getFilterValue() as string) ?? ""}
                    onChange={(event: any) =>
                        table.getColumn("month")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm border border-slate-200 rounded-lg"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto bg-transparent border-slate-200">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-black text-white rounded border border-gray-300">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value: any) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border border-slate-200">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="border-b border-slate-200 text-slate-200">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="border-b border-slate-200"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No Clients Found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4 ">
                <div className="flex-1 text-sm text-muted-foreground text-slate-200">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
