"use client";
import React, { useState, useCallback } from "react";
import TagModal from "./TagModal";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Image from "next/image";
import {
  PlusIcon,
  Squares2X2Icon,
  TrashIcon,
} from "@heroicons/react/24/outline";

// Draggable functionality added
const DraggableRow = ({ row, index, moveRow, children }) => {
  const [, drop] = useDrop({
    accept: "row",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveRow(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "row",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <tr
      ref={(node) => drag(drop(node))}
      className={`table-row ${isDragging ? "opacity-50" : ""}`}
      style={{ cursor: "move" }}
    >
      {children}
    </tr>
  );
};

const Table = () => {
  const [rows, setRows] = useState([
    {
      id: 1,
      filters: ["Anarkali Kurtas"],
      variant: "",
      images: [],
      fileNames: [],
    },
  ]);
  const [isTagModalOpen, setTagModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [columns, setColumns] = useState(["Primary Variant"]);

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const newRows = [...rows];
      const draggedRow = newRows[dragIndex];
      newRows.splice(dragIndex, 1);
      newRows.splice(hoverIndex, 0, draggedRow);
      setRows(newRows);
    },
    [rows]
  );

  const handleAddTag = (rowId) => {
    setSelectedRow(rowId);
    setTagModalOpen(true);
  };

  const handleRemoveTag = (rowId, tagToRemove) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              filters: row.filters.filter((tag) => tag !== tagToRemove),
            }
          : row
      )
    );
  };

  const handleTagSubmit = (newTag) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === selectedRow
          ? { ...row, filters: [...(row.filters || []), newTag] }
          : row
      )
    );
    setTagModalOpen(false);
  };

  const handleImageUpload = (e, rowId, columnIndex) => {
    const file = e.target.files[0];
    const fileUrl = URL.createObjectURL(file);
    const fileName = file.name;

    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              images: {
                ...row.images,
                [columnIndex]: fileUrl, // Store the image URL
              },
              fileNames: {
                ...row.fileNames,
                [columnIndex]: fileName, // Store the file name
              },
            }
          : row
      )
    );
  };

  const handleDeleteRow = (rowId) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== rowId));
  };

  const addRow = () => {
    const newRow = {
      id: rows.length + 1,
      filters: [],
      variant: "",
      images: [],
    };
    setRows([...rows, newRow]);
  };

  const addColumn = () => {
    const newColumnIndex = columns.length;
    setColumns([...columns, `Variant ${newColumnIndex + 1}`]);

    setRows((prevRows) =>
      prevRows.map((row) => ({
        ...row,
        images: {
          ...row.images,
          [newColumnIndex]: "",
        },
      }))
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="table-div">
        <table className="main-table">
          <thead>
            <tr>
              <th className="table-header number"></th>
              <th className="table-header product">Product Filters</th>
              {columns.map((column, index) => (
                <th key={index} className="table-header variant">
                  {column}
                </th>
              ))}
              <th className="table-header add"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <DraggableRow
                key={row.id}
                row={row}
                index={index}
                moveRow={moveRow}
              >
                <td className="table-cell">
                  <div className="serial-column">
                    <TrashIcon
                      className="delete-icon"
                      onClick={() => handleDeleteRow(row.id)}
                    ></TrashIcon>
                    <div className="serial-no">
                      {index + 1}
                      <Squares2X2Icon className="sidebar-icon" />
                    </div>
                  </div>
                </td>
                <td className="table-cell">
                  <div className="tag-container">
                    {row.filters &&
                      row.filters.map((tag, tagIndex) => (
                        <span key={tagIndex} className="tag">
                          {tag}
                          <button
                            className="remove-tag-btn"
                            onClick={() => handleRemoveTag(row.id, tag)}
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    <button
                      className="add-tag-btn"
                      onClick={() => handleAddTag(row.id)}
                    >
                      <PlusIcon className="add-icon" />
                      Add Product Filters
                    </button>
                  </div>
                </td>
                {columns.map((column, colIndex) => (
                  <td className="table-cell" key={colIndex}>
                    {row.images[colIndex] ? (
                      <div className="img-container">
                        <Image
                          className="img-pro"
                          src={row.images[colIndex]}
                          alt="variant"
                          width={150}
                          height={150}
                        />
                        <div className="file-name">
                          {row.fileNames[colIndex]}
                        </div>
                      </div>
                    ) : (
                      <div className="tag-container">
                        <button
                          className="insert-image-btn"
                          onClick={() =>
                            document
                              .getElementById(`upload-${row.id}-${colIndex}`)
                              .click()
                          }
                        >
                          <PlusIcon className="add-icon" />
                          Add Design
                        </button>
                      </div>
                    )}
                    <input
                      id={`upload-${row.id}-${colIndex}`}
                      type="file"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, row.id, colIndex)}
                    />
                  </td>
                ))}
                <td>
                  <div className="add-column">
                    <button className="add-row-btn" onClick={addColumn}>
                      <PlusIcon className="add-icon" />
                    </button>
                  </div>
                </td>
              </DraggableRow>
            ))}
            <tr className="add-row">
              <button className="add-row-btn" onClick={addRow}>
                <PlusIcon className="add-icon" />
              </button>
            </tr>
          </tbody>
        </table>
        <TagModal
          isOpen={isTagModalOpen}
          onClose={() => setTagModalOpen(false)}
          onSubmit={handleTagSubmit}
        />
      </div>
    </DndProvider>
  );
};

export default Table;
