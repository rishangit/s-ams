import React, { useState, useMemo, useEffect, useRef } from 'react'
import {
    Box,
    Paper,
    CircularProgress,
    Alert,
    Typography
} from '@mui/material'
import { AgGridReact } from 'ag-grid-react'
import {
    ColDef,
    GridApi,
    GridReadyEvent,
    ModuleRegistry,
    AllCommunityModule,
    ICellRendererParams
} from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import RowActionsMenu, { RowAction } from './RowActionsMenu'

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule])

interface CustomGridProps {
    title?: string
    data: any[]
    columnDefs: ColDef[]
    loading?: boolean
    error?: string | null
    success?: string | null
    onGridReady?: (params: GridReadyEvent) => void
    theme: {
        mode: 'light' | 'dark'
        primary: string
        surface: string
        text: string
        textSecondary: string
    }
    height?: string | number
    showTitle?: boolean
    showAlerts?: boolean
    rowActions?: RowAction[]
    rowHeight?: number
}

const CustomGrid: React.FC<CustomGridProps> = ({
    title,
    data,
    columnDefs,
    loading = false,
    error = null,
    success = null,
    onGridReady,
    theme,
    height = 'calc(100vh - 200px)',
    showTitle = true,
    showAlerts = true,
    rowActions = [],
    rowHeight = 60
}) => {
    const [gridApi, setGridApi] = useState<GridApi | null>(null)
    const [isMobile, setIsMobile] = useState(false)
    const highlightTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Check if screen is mobile size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        
        checkMobile()
        window.addEventListener('resize', checkMobile)
        
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (highlightTimeoutRef.current) {
                clearTimeout(highlightTimeoutRef.current)
            }
        }
    }, [])


    console.log('📊 CustomGrid Debug:', {
        title,
        dataLength: data ? data.length : 0,
        data: data,
        loading,
        error,
        success,
        columnDefsLength: columnDefs ? columnDefs.length : 0,
        rowActionsLength: rowActions ? rowActions.length : 0
    })

    const handleGridReady = (params: GridReadyEvent) => {
        console.log('🎯 Grid Ready Event:', {
            rowCount: params.api.getDisplayedRowCount(),
            dataLength: data ? data.length : 0,
            columnCount: params.api.getColumnDefs()?.length || 0
        })
        setGridApi(params.api)
        if (onGridReady) {
            onGridReady(params)
        }
    }

    // Function to highlight a row when menu action is clicked
    const handleRowHighlight = (rowData: any) => {
        const rowId = rowData.id || rowData.appointmentId || rowData.userId || rowData.companyId || rowData.staffId || rowData.serviceId
        if (rowId && gridApi) {
            console.log('🎯 Handle Row Highlight:', {
                rowId,
                isMobile,
                rowData
            })
            
            // Clear any existing timeout
            if (highlightTimeoutRef.current) {
                clearTimeout(highlightTimeoutRef.current)
                highlightTimeoutRef.current = null
            }
            
            // STEP 1: Clear ALL existing highlights immediately
            gridApi.forEachNode((node) => {
                if (node.data && node.id) {
                    const rowNode = gridApi.getRowNode(node.id)
                    const rowElement = (rowNode as any)?.rowElement
                    if (rowElement) {
                        rowElement.classList.remove('row-highlighted')
                    }
                }
            })
            
            // STEP 2: Find and highlight the specific row
            gridApi.forEachNode((node) => {
                if (node.data && node.id) {
                    const currentRowId = node.data.id || node.data.appointmentId || node.data.userId || node.data.companyId || node.data.staffId || node.data.serviceId
                    if (String(currentRowId) === String(rowId)) {
                        const rowNode = gridApi.getRowNode(node.id)
                        const rowElement = (rowNode as any)?.rowElement
                        if (rowElement) {
                            rowElement.classList.add('row-highlighted')
                            console.log('🎯 Highlighted row:', rowId)
                        }
                    }
                }
            })
            
            // STEP 3: Auto-remove highlight after 2 seconds
            highlightTimeoutRef.current = setTimeout(() => {
                console.log('🎯 Removing highlight for row:', rowId)
                gridApi.forEachNode((node) => {
                    if (node.data && node.id) {
                        const currentRowId = node.data.id || node.data.appointmentId || node.data.userId || node.data.companyId || node.data.staffId || node.data.serviceId
                        if (String(currentRowId) === String(rowId)) {
                            const rowNode = gridApi.getRowNode(node.id)
                            const rowElement = (rowNode as any)?.rowElement
                            if (rowElement) {
                                rowElement.classList.remove('row-highlighted')
                            }
                        }
                    }
                })
                highlightTimeoutRef.current = null
            }, 2000)
        }
    }

    // Actions column renderer
    const ActionsCellRenderer = (params: ICellRendererParams) => {
        if (!rowActions || rowActions.length === 0) return null
        
        // Use original actions - highlighting is handled by RowActionsMenu
        const wrappedActions = rowActions
        
        return (
            <RowActionsMenu
                rowData={params.data}
                actions={wrappedActions}
                theme={theme}
                onMenuClick={handleRowHighlight}
            />
        )
    }

    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        resizable: true,
        floatingFilter: true,
        flex: 1,
        minWidth: 100
    }), [])


    // Add actions column if rowActions are provided
    const finalColumnDefs = useMemo(() => {
        if (!rowActions || rowActions.length === 0) {
            return columnDefs
        }

        const actionsColumn: ColDef = {
            headerName: '',
            field: 'actions',
            width: 80,
            minWidth: 80,
            maxWidth: 80,
            sortable: false,
            filter: false,
            resizable: false,
            floatingFilter: false,
            cellRenderer: ActionsCellRenderer,
            cellStyle: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px'
            }
        }

        return [...columnDefs, actionsColumn]
    }, [columnDefs, rowActions, theme])

    // Debug final column definitions
    console.log('📊 CustomGrid Final Column Defs:', {
        finalColumnDefsLength: finalColumnDefs ? finalColumnDefs.length : 0,
        hasActionsColumn: rowActions && rowActions.length > 0
    })

    const gridStyle = useMemo(() => {
        const isDark = theme.mode === 'dark'
        
        return {
            height: height,
            width: '100%',
            '--ag-header-background-color': theme.primary,
            '--ag-header-foreground-color': '#ffffff',
            '--ag-font-family': 'inherit',
            '--ag-font-size': '14px',
            '--ag-border-color': isDark ? '#334155' : '#e5e7eb',
            '--ag-row-border-color': isDark ? '#1e293b' : '#f3f4f6',
            '--ag-odd-row-background-color': isDark ? '#1e293b' : '#fafafa',
            '--ag-row-hover-color': isDark ? '#334155' : '#f0f9ff',
            '--ag-selected-row-background-color': `${theme.primary}20`,
            '--ag-cell-horizontal-border': `solid ${isDark ? '#1e293b' : '#f3f4f6'}`,
            '--ag-cell-horizontal-border-width': '1px',
            '--ag-background-color': isDark ? '#0f172a' : '#ffffff',
            '--ag-foreground-color': isDark ? '#f8fafc' : '#1f2937'
        } as React.CSSProperties
    }, [theme, height])

    if (loading) {
        return (
            <Box className="flex justify-center items-center" style={{ height }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box className="h-full flex flex-col">
            {/* CSS for row highlighting */}
            <style>
                {`
                    .row-highlighted {
                        background-color: ${theme.mode === 'dark' ? '#1e40af40' : '#3b82f640'} !important;
                        transition: background-color 0.3s ease !important;
                    }
                    .row-highlighted .ag-cell {
                        background-color: transparent !important;
                    }
                    /* Mobile-specific overrides */
                    @media (max-width: 768px) {
                        .row-highlighted {
                            background-color: ${theme.mode === 'dark' ? '#1e40af40' : '#3b82f640'} !important;
                        }
                        .row-highlighted .ag-cell {
                            background-color: transparent !important;
                        }
                    }
                `}
            </style>
            
            {/* Title Section */}
            {showTitle && title && (
                <Box className="mb-4">
                    <Typography
                        variant="h4"
                        className="font-bold"
                        style={{ color: theme.text }}
                    >
                        {title}
                    </Typography>
                </Box>
            )}

            {/* Alerts Section */}
            {showAlerts && (success || error) && (
                <Box className="mb-4 space-y-2">
                    {success && (
                        <Alert severity="success" className="rounded-lg">
                            {success}
                        </Alert>
                    )}
                    {error && (
                        <Alert severity="error" className="rounded-lg">
                            {error}
                        </Alert>
                    )}
                </Box>
            )}

            {/* Grid Section */}
            <Paper
                className="flex-1 overflow-hidden rounded-lg shadow-sm"
                style={{ 
                    backgroundColor: theme.surface,
                    border: `1px solid ${theme.mode === 'dark' ? '#334155' : '#e5e7eb'}`
                }}
            >
                <Box
                    className="ag-theme-alpine h-full w-full"
                    style={gridStyle}
                >
                    {/* @ts-ignore */}
                    <AgGridReact
                        theme="legacy"
                        rowData={data || []}
                        columnDefs={finalColumnDefs}
                        onGridReady={handleGridReady}
                        pagination={true}
                        paginationPageSize={20}
                        paginationPageSizeSelector={isMobile ? false : [10, 20, 50, 100]}
                        defaultColDef={defaultColDef}
                        animateRows={true}
                        domLayout="normal"
                        suppressCellFocus={false}
                        enableCellTextSelection={true}
                        suppressRowHoverHighlight={false}
                        suppressColumnVirtualisation={false}
                        suppressRowVirtualisation={false}
                        rowHeight={rowHeight}
                        headerHeight={50}
                        suppressColumnMoveAnimation={false}
                    />
                </Box>
            </Paper>
        </Box>
    )
}

export default CustomGrid
