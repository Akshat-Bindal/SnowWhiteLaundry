'use client';

import { useState, useEffect } from 'react';
import { Button, Card, CardFooter, CardHeader, Col, Row, Modal, Form } from 'react-bootstrap';
import { LuSearch, LuShuffle } from 'react-icons/lu';
import { TbAlertTriangle, TbPlus, TbTrash } from 'react-icons/tb';
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import DataTable from '@/components/table/DataTable';
import DeleteConfirmationModal from '@/components/table/DeleteConfirmationModal';
import TablePagination from '@/components/table/TablePagination';
import Link from 'next/link';

const columnHelper = createColumnHelper();

const TicketTabel = () => {
  const [data, setData] = useState([]); // invoices
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 8,
  });
  const [selectedRowIds, setSelectedRowIds] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // For editing status
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // 🔵 Fetch invoices from backend
  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = () => {
    fetch("https://snowwhite-admin.onrender.com/api/invoices")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setData(data);
        } else if (Array.isArray(data.invoices)) {
          setData(data.invoices);
        } else {
          setData([]);
        }
      })
      .catch((err) => {
        console.error("Invoices fetch error:", err);
        setData([]);
      });
  };

  // 🔵 Update status
  const handleEditStatus = async () => {
    if (!editingRow) return;

    try {
      await fetch(`https://snowwhite-admin.onrender.com/api/invoices/${editingRow._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      fetchInvoices(); // refresh table
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setShowEditModal(false);
      setEditingRow(null);
    }
  };

  // 🔴 Delete selected invoices in DB
  const handleDelete = async () => {
    const idsToDelete = Object.keys(selectedRowIds).map(
      (rowId) => data[rowId]._id
    );

    try {
      await Promise.all(
        idsToDelete.map((id) =>
          fetch(`https://snowwhite-admin.onrender.com/api/invoices/${id}`, {
            method: "DELETE",
          })
        )
      );

      fetchInvoices(); // Refresh table
      setSelectedRowIds({});
      setPagination({ ...pagination, pageIndex: 0 });
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal);

  // ✅ Table columns
  const columns = [
    columnHelper.accessor('_id', {
      header: 'Order ID',
      cell: ({ row }) => (
        <Link
          href={`/ticket-details/?id=${row.original._id}`}
          className="fw-semibold link-reset"
        >
          #{row.original._id.slice(-6).toUpperCase()}
        </Link>
      ),
    }),
    columnHelper.accessor('customerName', { header: 'Customer Name' }),
    columnHelper.accessor('customerAddress', { header: 'Address' }),
    columnHelper.accessor('total', {
      header: 'Bill Amount',
      cell: ({ row }) => <span>₹{row.original.total}</span>,
    }),
    columnHelper.accessor('priority', {
      header: 'Priority',
      cell: ({ row }) => {
        const priority = row.original.priority || "Low";
        const color =
          priority === 'High'
            ? 'text-bg-danger'
            : priority === 'Medium'
              ? 'text-bg-warning'
              : 'text-bg-primary';
        return <span className={`badge ${color}`}>{priority}</span>;
      },
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      filterFn: 'equalsString',
      cell: ({ row }) => {
        const status = row.original.status || "Pending";
        let badgeClass = '';
        switch (status) {
          case 'Requested': badgeClass = 'bg-warning-subtle text-warning'; break;
          case 'Picked_up': badgeClass = 'bg-info-subtle text-info'; break;
          case 'Processing': badgeClass = 'bg-success-subtle text-success'; break;
          case 'Ready': badgeClass = 'bg-secondary-subtle text-secondary'; break;
          case 'Out for Delivery': badgeClass = 'bg-danger-subtle text-danger'; break;
          case 'Delivered': badgeClass = 'bg-success-subtle text-success'; break;
          default: badgeClass = 'bg-secondary-subtle text-secondary';
        }
        return <span className={`badge ${badgeClass} badge-label`}>{status}</span>;
      },
    }),
    columnHelper.accessor('orderDate', {
      header: 'Order Date',
      cell: ({ row }) => <>{new Date(row.original.orderDate).toLocaleDateString()}</>,
    }),
    columnHelper.accessor('deliveryDate', {
      header: 'Delivery Date',
      cell: ({ row }) => <>{new Date(row.original.deliveryDate).toLocaleDateString()}</>,
    }),
    {
      header: 'Actions',
      cell: ({ row }) => (
        <div className="d-flex gap-1">
          {/* ✏️ Edit Button */}
          <Button
            size="sm"
            variant="warning"
            className="btn-icon btn-sm rounded"
            onClick={() => {
              setEditingRow(row.original);
              setNewStatus(row.original.status || "Pending");
              setShowEditModal(true);
            }}
          >
            ✏️
          </Button>

          {/* 🗑 Delete Button */}
          <Button
            size="sm"
            variant="danger"
            className="btn-icon btn-sm rounded"
            onClick={() => {
              setSelectedRowIds({ [row.id]: true });
              toggleDeleteModal();
            }}
          >
            <TbTrash className="fs-lg" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
      pagination,
      rowSelection: selectedRowIds,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onRowSelectionChange: setSelectedRowIds,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: 'includesString',
    enableColumnFilters: true,
    enableRowSelection: true,
  });

  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const totalItems = table.getFilteredRowModel().rows.length;
  const start = pageIndex * pageSize + 1;
  const end = Math.min(start + pageSize - 1, totalItems);

  return (
    <Row>
      <Col cols={12}>
        <Card>
          <CardHeader className="border-light justify-content-between">
            <div className="d-flex gap-2">
              <div className="app-search">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search orders..."
                  value={globalFilter ?? ''}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                />
                <LuSearch className="app-search-icon text-muted" />
              </div>

              {Object.keys(selectedRowIds).length > 0 && (
                <Button variant="danger" size="sm" onClick={toggleDeleteModal}>
                  Delete
                </Button>
              )}

              <Link href="/add-invoice" className="btn btn-primary">
                <TbPlus className="me-1" /> New Order
              </Link>
            </div>

            <div className="d-flex align-items-center gap-2">
              <span className="me-2 fw-semibold">Filter By:</span>
              <div className="app-search">
                <select
                  className="form-select form-control my-1 my-md-0"
                  value={table.getColumn('status')?.getFilterValue() ?? ''}
                  onChange={(e) =>
                    table.getColumn('status')?.setFilterValue(
                      e.target.value === '' ? undefined : e.target.value
                    )
                  }
                >
                  <option value="">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                  <option value="Delivered">Delivered</option>
                </select>
                <LuShuffle className="app-search-icon text-muted" />
              </div>

              <div className="app-search">
                <select
                  className="form-select form-control my-1 my-md-0"
                  value={table.getColumn('priority')?.getFilterValue() ?? ''}
                  onChange={(e) =>
                    table.getColumn('priority')?.setFilterValue(
                      e.target.value === '' ? undefined : e.target.value
                    )
                  }
                >
                  <option value="">Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <TbAlertTriangle className="app-search-icon text-muted" />
              </div>
            </div>
          </CardHeader>

          <DataTable table={table} emptyMessage="No records found" />

          {table.getRowModel().rows.length > 0 && (
            <CardFooter className="border-0">
              <TablePagination
                totalItems={totalItems}
                start={start}
                end={end}
                itemsName="invoices"
                showInfo
                previousPage={table.previousPage}
                canPreviousPage={table.getCanPreviousPage()}
                pageCount={table.getPageCount()}
                pageIndex={pageIndex}
                setPageIndex={table.setPageIndex}
                nextPage={table.nextPage}
                canNextPage={table.getCanNextPage()}
              />
            </CardFooter>
          )}

          <DeleteConfirmationModal
            show={showDeleteModal}
            onHide={toggleDeleteModal}
            onConfirm={handleDelete}
            selectedCount={Object.keys(selectedRowIds).length}
            itemName="invoices"
          />

          {/* Edit Status Modal */}
          <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Edit Order Status</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                  <option value="Delivered">Delivered</option>
              </Form.Select>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleEditStatus}>
                Save
              </Button>
            </Modal.Footer>
          </Modal>
        </Card>
      </Col>
    </Row>
  );
};

export default TicketTabel;
