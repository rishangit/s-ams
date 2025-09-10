import React, { useState, useMemo } from 'react'
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
    AllCommunityModule
} from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

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
    showAlerts = true
}) => {
    const [, setGridApi] = useState<GridApi | null>(null)

    console.log('📊 CustomGrid Debug:', {
        title,
        dataLength: data ? data.length : 0,
        data: data,
        loading,
        error,
        success,
        columnDefsLength: columnDefs ? columnDefs.length : 0
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

    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        resizable: true,
        floatingFilter: true,
        flex: 1,
        minWidth: 100
    }), [])

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
            {showAlerts && (
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
                        columnDefs={columnDefs}
                        onGridReady={handleGridReady}
                        pagination={true}
                        paginationPageSize={20}
                        paginationPageSizeSelector={[10, 20, 50, 100]}
                        defaultColDef={defaultColDef}
                        animateRows={true}
                        domLayout="normal"
                        suppressCellFocus={false}
                        enableCellTextSelection={true}
                        suppressRowHoverHighlight={false}
                        suppressColumnVirtualisation={false}
                        suppressRowVirtualisation={false}
                        rowHeight={60}
                        headerHeight={50}
                        suppressColumnMoveAnimation={false}
                    />
                </Box>
            </Paper>
        </Box>
    )
}

export default CustomGrid
