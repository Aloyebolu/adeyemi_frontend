'use client';

import { useState, useEffect } from 'react';
import {
    Card,
    Title,
    Text,
    Badge,
    Metric,
    Flex,
    ProgressBar,
} from '@tremor/react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    Legend,
    LineChart,
    Line,
} from 'recharts';
import {
    FiFilter,
    FiDownload,
    FiCheckCircle,
    FiClock,
    FiXCircle,
    FiBook,
    FiRefreshCw,
} from 'react-icons/fi';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/Button';
import { useDataFetcher } from '@/lib/dataFetcher';
import { usePage } from '@/hooks/usePage';

// Type definitions based on your backend response
interface StatusChartItem {
    label: string;
    value: number;
}

interface LevelChartItem {
    level: number;
    total: number;
}

interface SemesterChartItem {
    semester: string;
    total: number;
}

interface SummaryData {
    total_registrations: number;
    approved: number;
    pending: number;
    rejected: number;
    total_units: number;
    carryovers: number;
}

interface Filters {
    level: string;
    semester: string;
    session: string;
}

interface ReportData {
    success: boolean;
    role: string;
    filters_applied: Filters;
    summary: SummaryData;
    charts: {
        status_chart: StatusChartItem[];
        level_chart: LevelChartItem[];
        semester_chart: SemesterChartItem[];
    };
}

// Mock data for development (replace with actual API call)
const mockData: ReportData = {
    success: true,
    role: 'hod',
    filters_applied: {
        level: 'all',
        semester: 'all',
        session: 'all',
    },
    summary: {
        total_registrations: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
        total_units: 0,
        carryovers: 0,
    },
    charts: {
        status_chart: [
            { label: 'Approved', value: 0 },
            { label: 'Pending', value: 0 },
            { label: 'Rejected', value: 0 },
        ],
        level_chart: [
            { level: 100, total: 0 },
            { level: 200, total: 0 },
            { level: 300, total: 0 },
            { level: 400, total: 0 },
            { level: 500, total: 0 },
        ],
        semester_chart: [
            { semester: 'First', total: 0 },
            { semester: 'Second', total: 0 },
            { semester: 'Harmattan', total: 0 },
            { semester: 'Rain', total: 0 },
        ],
    },
};

// Color palettes using Tailwind config keys
const STATUS_COLORS: Record<string, string> = {
    Approved: 'var(--color-success)',
    Pending: 'var(--color-warning)',
    Rejected: 'var(--color-error)',
};

const STATUS_ICONS = {
    Approved: FiCheckCircle,
    Pending: FiClock,
    Rejected: FiXCircle,
};

const STATUS_COLORS_TAILWIND = {
    Approved: 'success',
    Pending: 'warning',
    Rejected: 'error',
};

export default function CourseRegistrationReportPage() {
    const [reportData, setReportData] = useState<ReportData>(mockData);
    const [loading, setLoading] = useState(false);
    const { get } = useDataFetcher()
      const { setPage } = usePage()
      useEffect(() => {
        setPage("Course Reg. Stas")
      }, []);
    const [filters, setFilters] = useState({
        level: 'all',
        semester: 'all',
        session: 'all',
    });

    // Filter options - using 'all' instead of empty string for default
    const levelOptions = [
        { value: 'all', label: 'All Levels' },
        { value: '100', label: '100 Level' },
        { value: '200', label: '200 Level' },
        { value: '300', label: '300 Level' },
        { value: '400', label: '400 Level' },
        { value: '500', label: '500 Level' },
    ];

    const semesterOptions = [
        { value: 'all', label: 'All Semesters' },
        { value: 'first', label: 'First Semester' },
        { value: 'second', label: 'Second Semester' },
    ];

    const sessionOptions = [
        { value: 'all', label: 'All Sessions' },
        { value: '2023/2024', label: '2023/2024' },
        { value: '2022/2023', label: '2022/2023' },
        { value: '2021/2022', label: '2021/2022' },
    ];

    const fetchReportData = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (filters.level && filters.level !== 'all') queryParams.append('level', filters.level);
            if (filters.semester && filters.semester !== 'all') queryParams.append('semester', filters.semester);
            if (filters.session && filters.session !== 'all') queryParams.append('session', filters.session);

            const {data} = await get(
                `/course/stats?${queryParams}`,
            );

            setReportData(data);
        } catch (error) {
            console.error('Error fetching report:', error);
            setReportData(mockData);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReportData();
    }, [filters]);

    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleExportData = () => {
        const dataStr = JSON.stringify(reportData, null, 2);
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
        const exportFileDefaultName = `course-registration-report-${new Date().toISOString()}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const calculateApprovalRate = () => {
        const { total_registrations, approved } = reportData.summary;
        return total_registrations > 0 ? (approved / total_registrations) * 100 : 0;
    };

    const SummaryCard = ({
        title,
        value,
        icon: Icon,
        color,
        description
    }: {
        title: string;
        value: number;
        icon: any;
        color: string;
        description?: string;
    }) => {
        const colorClasses = {
            success: 'bg-success/10 text-success',
            warning: 'bg-warning/10 text-warning',
            error: 'bg-error/10 text-error',
            primary: 'bg-primary/10 text-primary',
            info: 'bg-info/10 text-info',
            secondary: 'bg-secondary/10 text-secondary',
        };

        return (
            <div className="p-4 rounded-card bg-background border border-border shadow-medium">
                <div className="flex items-start">
                    <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
                        <Icon className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm text-text2">{title}</p>
                        <p className="text-2xl font-bold text-text-primary">{value?.toLocaleString()}</p>
                        {description && (
                            <p className="text-xs text-text2 mt-1">{description}</p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-surface-elevated border border-border rounded-card p-3 shadow-medium">
                    <p className="text-sm font-medium text-text-primary">{label}</p>
                    <p className="text-sm text-text2">
                        {payload[0].name}: {payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    // Custom Grid component to replace @tremor/react Grid
    const Grid = ({
        children,
        cols = 1,
        colsSm,
        colsMd,
        colsLg,
        gap = 4
    }: {
        children: React.ReactNode;
        cols?: number;
        colsSm?: number;
        colsMd?: number;
        colsLg?: number;
        gap?: number;
    }) => {
        const colClasses = [
            cols && `grid-cols-${cols}`,
            colsSm && `sm:grid-cols-${colsSm}`,
            colsMd && `md:grid-cols-${colsMd}`,
            colsLg && `lg:grid-cols-${colsLg}`,
        ].filter(Boolean).join(' ');

        return (
            <div className={`grid ${colClasses} gap-${gap}`}>
                {children}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-background p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">
                            Course Registration Report
                        </h1>
                        <p className="text-text2">
                            {reportData.role === 'hod' ? 'Department Head View' : 'Administrator View'}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* <Button
                            variant="outline"
                            onClick={handleExportData}
                            className="border-border text-text-primary hover:bg-surface"
                        >
                            <FiDownload className="mr-2 h-4 w-4" />
                            Export Data
                        </Button> */}
                        <Button
                            onClick={fetchReportData}
                            disabled={loading}
                            className="bg-primary text-on-brand hover:bg-primary-hover"
                        >
                            <FiRefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6 p-4 rounded-card bg-background2 border border-border">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex items-center gap-2">
                            <FiFilter className="h-5 w-5 text-text2" />
                            <span className="text-text-primary font-medium">Filters</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full sm:w-auto">
                            {/* Level Filter */}
                            <Select
                                value={filters.level}
                                onValueChange={(value) => handleFilterChange('level', value)}
                            >
                                <SelectTrigger className="w-full bg-surface border-border">
                                    <SelectValue placeholder="Select Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    {levelOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Semester Filter */}
                            <Select
                                value={filters.semester}
                                onValueChange={(value) => handleFilterChange('semester', value)}
                            >
                                <SelectTrigger className="w-full bg-surface border-border">
                                    <SelectValue placeholder="Select Semester" />
                                </SelectTrigger>
                                <SelectContent>
                                    {semesterOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Session Filter */}
                            <Select
                                value={filters.session}
                                onValueChange={(value) => handleFilterChange('session', value)}
                            >
                                <SelectTrigger className="w-full bg-surface border-border">
                                    <SelectValue placeholder="Select Session" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sessionOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {Object.values(filters).some(f => f !== 'all') && (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="text-sm text-text2">Active filters:</span>
                            {filters.level !== 'all' && (
                                <Badge className="text-xs bg-primary/20 text-primary border-primary/20">
                                    Level {filters.level}
                                </Badge>
                            )}
                            {filters.semester !== 'all' && (
                                <Badge className="text-xs bg-primary/20 text-primary border-primary/20">
                                    {semesterOptions.find(o => o.value === filters.semester)?.label}
                                </Badge>
                            )}
                            {filters.session !== 'all' && (
                                <Badge className="text-xs bg-primary/20 text-primary border-primary/20">
                                    {filters.session}
                                </Badge>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Summary Cards */}
            <Grid cols={1} colsSm={2} colsLg={3} gap={6} className="mb-8">
                <SummaryCard
                    title="Total Registrations"
                    value={reportData.summary.total_registrations}
                    icon={FiBook}
                    color="primary"
                    description={`${calculateApprovalRate().toFixed(1)}% approved`}
                />
                <SummaryCard
                    title="Approved"
                    value={reportData.summary.approved}
                    icon={FiCheckCircle}
                    color="success"
                    description={`${((reportData.summary.approved / reportData.summary.total_registrations) * 100 || 0).toFixed(1)}% of total`}
                />
                <SummaryCard
                    title="Pending"
                    value={reportData.summary.pending}
                    icon={FiClock}
                    color="warning"
                    description={`${((reportData.summary.pending / reportData.summary.total_registrations) * 100 || 0).toFixed(1)}% of total`}
                />
                <SummaryCard
                    title="Rejected"
                    value={reportData.summary.rejected}
                    icon={FiXCircle}
                    color="error"
                    description={`${((reportData.summary.rejected / reportData.summary.total_registrations) * 100 || 0).toFixed(1)}% of total`}
                />
                <SummaryCard
                    title="Total Units"
                    value={reportData.summary.total_units}
                    icon={FiBook}
                    color="info"
                    description={`Avg: ${(reportData.summary.total_units / reportData.summary.total_registrations || 0).toFixed(1)} units/student`}
                />
                <SummaryCard
                    title="Carryovers"
                    value={reportData.summary.carryovers}
                    icon={FiRefreshCw}
                    color="secondary"
                    description={`${((reportData.summary.carryovers / reportData.summary.total_registrations) * 100 || 0).toFixed(1)}% of students`}
                />
            </Grid>

            {/* Approval Progress */}
            <div className="mb-8 p-6 rounded-card bg-background border border-border">
                <h2 className="mb-4 text-lg font-semibold text-text-primary">
                    Registration Approval Progress
                </h2>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-text2">
                        <span>Approval Rate</span>
                        <span>{calculateApprovalRate().toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-surface rounded-full overflow-hidden">
                        <div
                            className="h-full bg-success rounded-full"
                            style={{ width: `${calculateApprovalRate()}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-text2 mt-2">
                        <span>Pending Review: {reportData.summary.pending} registrations</span>
                        <span>Total: {reportData.summary.total_registrations}</span>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <Grid cols={1} colsLg={3} gap={6}>
                {/* Status Distribution Pie Chart */}
                <div className="p-6 rounded-card bg-background border border-border">
                    <h2 className="mb-4 text-lg font-semibold text-text-primary">
                        Registration Status
                    </h2>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={reportData.charts.status_chart}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(entry) => `${entry.label}: ${entry.value}`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {reportData.charts.status_chart.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={STATUS_COLORS[entry.label]}
                                        />
                                    ))}
                                </Pie>
                                <RechartsTooltip content={<CustomTooltip />} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-2">
                        {reportData.charts.status_chart.map((item) => {
                            const Icon = STATUS_ICONS[item.label as keyof typeof STATUS_ICONS];
                            const color = STATUS_COLORS_TAILWIND[item.label as keyof typeof STATUS_COLORS_TAILWIND];

                            return (
                                <div key={item.label} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        {Icon && (
                                            <Icon className={`h-4 w-4 mr-2 text-${color}`} />
                                        )}
                                        <span className="text-sm text-text2">{item.label}</span>
                                    </div>
                                    <span className="text-sm font-medium text-text-primary">
                                        {item.value} ({((item.value / reportData.summary.total_registrations) * 100 || 0).toFixed(1)}%)
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Level Distribution Bar Chart */}
                <div className="p-6 rounded-card bg-background border border-border">
                    <h2 className="mb-4 text-lg font-semibold text-text-primary">
                        Registrations by Level
                    </h2>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={reportData.charts.level_chart}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    className="stroke-border"
                                />
                                <XAxis
                                    dataKey="level"
                                    className="text-text-primary"
                                    fontSize={12}
                                />
                                <YAxis
                                    className="text-text-primary"
                                    fontSize={12}
                                />
                                <RechartsTooltip content={<CustomTooltip />} />
                                <Bar
                                    dataKey="total"
                                    name="Registrations"
                                    radius={[4, 4, 0, 0]}
                                    className="fill-primary"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-5 gap-2">
                        {reportData.charts.level_chart.map((item, index) => (
                            <div
                                key={item.level}
                                className="text-center p-2 rounded-card bg-surface"
                            >
                                <span className="text-xs font-semibold text-text-primary">
                                    Level {item.level}
                                </span>
                                <p className="text-lg font-bold text-primary">
                                    {item.total}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Semester Trend Line Chart */}
                <div className="p-6 rounded-card bg-background border border-border">
                    <h2 className="mb-4 text-lg font-semibold text-text-primary">
                        Semester Trend
                    </h2>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={reportData.charts.semester_chart}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    className="stroke-border"
                                />
                                <XAxis
                                    dataKey="semester"
                                    className="text-text-primary"
                                    fontSize={12}
                                />
                                <YAxis
                                    className="text-text-primary"
                                    fontSize={12}
                                />
                                <RechartsTooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    className="stroke-success"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-sm text-text2 mb-2">Overview by Semester</h3>
                        <div className="space-y-3">
                            {reportData.charts.semester_chart.map((item, index) => (
                                <div key={item.semester} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 rounded-full mr-2 bg-success" />
                                        <span className="text-sm text-text2">{item.semester} Semester</span>
                                    </div>
                                    <span className="text-sm font-medium text-text-primary">
                                        {item.total} registrations
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Grid>

            {/* Footer Stats */}
            <div className="mt-8 p-6 rounded-card bg-background border border-border">
                <Grid cols={2} colsLg={4} gap={4}>
                    <div className="text-center p-4 rounded-card bg-surface">
                        <p className="text-sm text-text2">Avg Units per Registration</p>
                        <p className="text-2xl font-bold text-primary">
                            {(reportData.summary.total_units / reportData.summary.total_registrations || 0).toFixed(1)}
                        </p>
                    </div>
                    <div className="text-center p-4 rounded-card bg-surface">
                        <p className="text-sm text-text2">Pending Rate</p>
                        <p className="text-2xl font-bold text-warning">
                            {((reportData.summary.pending / reportData.summary.total_registrations) * 100 || 0).toFixed(1)}%
                        </p>
                    </div>
                    <div className="text-center p-4 rounded-card bg-surface">
                        <p className="text-sm text-text2">Carryover Rate</p>
                        <p className="text-2xl font-bold text-secondary">
                            {((reportData.summary.carryovers / reportData.summary.total_registrations) * 100 || 0).toFixed(1)}%
                        </p>
                    </div>
                    <div className="text-center p-4 rounded-card bg-surface">
                        <p className="text-sm text-text2">Approval Efficiency</p>
                        <p className="text-2xl font-bold text-success">
                            {((reportData.summary.approved / (reportData.summary.approved + reportData.summary.rejected)) * 100 || 0).toFixed(1)}%
                        </p>
                    </div>
                </Grid>
            </div>
        </div>
    );
}