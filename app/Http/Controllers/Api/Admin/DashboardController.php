<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json(['message' => 'Admin Dashboard']);
    }

    public function stats()
    {
        $stats = \Illuminate\Support\Facades\Cache::remember('admin_dashboard_stats', 600, function () {
            $totalOrders = Order::count();
            $totalUsers = User::where('role', 'customer')->count();
            $totalProducts = Product::count();
            $totalRevenue = Order::where('payment_status', 'completed')->sum('total');
            
            $recentOrders = Order::with('user')
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get();

            $salesChart = Order::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total) as revenue'),
                DB::raw('COUNT(*) as count')
            )
            ->where('payment_status', 'completed')
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

            return [
                'total_orders' => $totalOrders,
                'total_users' => $totalUsers,
                'total_products' => $totalProducts,
                'total_revenue' => $totalRevenue,
                'recent_orders' => $recentOrders,
                'sales_chart' => $salesChart
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
    public function clearCache()
    {
        \Illuminate\Support\Facades\Cache::flush();
        
        return response()->json([
            'success' => true,
            'message' => 'Application cache cleared successfully.'
        ]);
    }
}
