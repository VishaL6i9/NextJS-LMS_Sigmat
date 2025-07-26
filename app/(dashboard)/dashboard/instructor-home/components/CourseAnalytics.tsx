'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    BarChart3,
    TrendingUp,
    DollarSign,
    Users,
    Calendar,
    Download
} from "lucide-react";
import {
    getCourseRevenue,
    getCoursePurchaseAnalytics,
    CourseRevenueResponse,
    CoursePurchase
} from "@/app/components/services/api";
import { useToast } from "@/hooks/use-toast";

interface CourseAnalyticsProps {
    courses: Array<{
        id: string;
        courseName: string;
        courseCode: string;
        studentsEnrolled: number;
        courseFee: number;
        rating: number;
    }>;
}

interface CourseAnalyticsData {
    courseId: string;
    courseName: string;
    revenue: CourseRevenueResponse;
    purchases: CoursePurchase[];
    conversionRate: number;
    averageOrderValue: number;
}

export function CourseAnalytics({ courses }: CourseAnalyticsProps) {
    const [analyticsData, setAnalyticsData] = useState<CourseAnalyticsData[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

    const { toast } = useToast();

    useEffect(() => {
        fetchAnalyticsData();
    }, [courses]);

    const fetchAnalyticsData = async () => {
        try {
            setIsLoading(true);

            const analyticsPromises = courses.map(async (course) => {
                try {
                    const [revenue, purchases] = await Promise.all([
                        getCourseRevenue(course.id),
                        getCoursePurchaseAnalytics(course.id)
                    ]);

                    // Calculate conversion rate (purchases vs enrollments)
                    const conversionRate = course.studentsEnrolled > 0
                        ? (purchases.length / course.studentsEnrolled) * 100
                        : 0;

                    // Calculate average order value
                    const totalRevenue = purchases.reduce((sum, purchase) => sum + purchase.finalAmount, 0);
                    const averageOrderValue = purchases.length > 0 ? totalRevenue / purchases.length : 0;

                    return {
                        courseId: course.id,
                        courseName: course.courseName,
                        revenue,
                        purchases,
                        conversionRate,
                        averageOrderValue
                    };
                } catch (error) {
                    console.error(`Failed to fetch analytics for course ${course.id}:`, error);
                    return {
                        courseId: course.id,
                        courseName: course.courseName,
                        revenue: { courseId: parseInt(course.id), totalRevenue: 0, totalEnrollments: 0 },
                        purchases: [],
                        conversionRate: 0,
                        averageOrderValue: 0
                    };
                }
            });

            const analytics = await Promise.all(analyticsPromises);
            setAnalyticsData(analytics);

        } catch (error) {
            console.error('Failed to fetch analytics data:', error);
            toast({
                title: "Error",
                description: "Failed to load analytics data.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getFilteredData = () => {
        let filtered = analyticsData;

        if (selectedCourse !== 'all') {
            filtered = filtered.filter(data => data.courseId === selectedCourse);
        }

        // Filter by time range
        if (timeRange !== 'all') {
            const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);

            filtered = filtered.map(data => ({
                ...data,
                purchases: data.purchases.filter(purchase =>
                    new Date(purchase.purchaseDate) > cutoffDate
                )
            }));
        }

        return filtered;
    };

    const getOverallStats = () => {
        const filteredData = getFilteredData();

        const totalRevenue = filteredData.reduce((sum, data) =>
            sum + data.purchases.reduce((purchaseSum, purchase) => purchaseSum + purchase.finalAmount, 0), 0
        );

        const totalPurchases = filteredData.reduce((sum, data) => sum + data.purchases.length, 0);

        const totalEnrollments = filteredData.reduce((sum, data) => sum + data.revenue.totalEnrollments, 0);

        const averageConversionRate = filteredData.length > 0
            ? filteredData.reduce((sum, data) => sum + data.conversionRate, 0) / filteredData.length
            : 0;

        return {
            totalRevenue,
            totalPurchases,
            totalEnrollments,
            averageConversionRate
        };
    };

    const exportAnalytics = () => {
        const data = getFilteredData();
        const csvContent = [
            ['Course Name', 'Total Revenue', 'Total Purchases', 'Total Enrollments', 'Conversion Rate', 'Average Order Value'],
            ...data.map(item => [
                item.courseName,
                item.purchases.reduce((sum, p) => sum + p.finalAmount, 0),
                item.purchases.length,
                item.revenue.totalEnrollments,
                item.conversionRate.toFixed(2) + '%',
                item.averageOrderValue.toFixed(2)
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `course-analytics-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const overallStats = getOverallStats();
    const filteredData = getFilteredData();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-indigo-500 mx-auto"></div>
                    <p className="mt-2 text-gray-700">Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filters */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Course Analytics
                        </CardTitle>
                        <Button
                            onClick={exportAnalytics}
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                            size="sm"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Export CSV
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="px-4 py-3 bg-white/80 backdrop-blur-sm border-0 shadow-md rounded-lg focus:shadow-lg transition-all duration-300 text-gray-700"
                        >
                            <option value="all">All Courses</option>
                            {courses.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.courseName}
                                </option>
                            ))}
                        </select>

                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value as any)}
                            className="px-4 py-3 bg-white/80 backdrop-blur-sm border-0 shadow-md rounded-lg focus:shadow-lg transition-all duration-300 text-gray-700"
                        >
                            <option value="7d">Last 7 days</option>
                            <option value="30d">Last 30 days</option>
                            <option value="90d">Last 90 days</option>
                            <option value="all">All time</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{overallStats.totalRevenue.toLocaleString()}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overallStats.totalPurchases}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overallStats.totalEnrollments}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Conversion Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overallStats.averageConversionRate.toFixed(1)}%</div>
                    </CardContent>
                </Card>
            </div>

            {/* Course-wise Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredData.map((data) => (
                    <Card key={data.courseId}>
                        <CardHeader>
                            <CardTitle className="text-lg">{data.courseName}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Revenue</p>
                                    <p className="text-xl font-bold">
                                        ₹{data.purchases.reduce((sum, p) => sum + p.finalAmount, 0).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Purchases</p>
                                    <p className="text-xl font-bold">{data.purchases.length}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Enrollments</p>
                                    <p className="text-xl font-bold">{data.revenue.totalEnrollments}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Conversion Rate</p>
                                    <p className="text-xl font-bold">{data.conversionRate.toFixed(1)}%</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Average Order Value</p>
                                <p className="text-lg font-semibold">₹{data.averageOrderValue.toFixed(2)}</p>
                            </div>

                            {/* Recent Purchases */}
                            {data.purchases.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium mb-2">Recent Purchases</p>
                                    <div className="space-y-2 max-h-32 overflow-y-auto">
                                        {data.purchases.slice(0, 3).map((purchase) => (
                                            <div key={purchase.id} className="flex justify-between items-center text-sm">
                                                <span>User {purchase.userId}</span>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={purchase.status === 'COMPLETED' ? 'default' : 'secondary'}>
                                                        {purchase.status}
                                                    </Badge>
                                                    <span>₹{purchase.finalAmount}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}