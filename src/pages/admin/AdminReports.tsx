
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, TrendingUp, Users, Package, ShoppingCart, Filter } from 'lucide-react';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import AdminLoader from '@/components/admin/AdminLoader';

const AdminReports = () => {
  const { stats, recentOrders, topProducts, isLoading } = useAdminDashboard();
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const reportTypes = [
    { value: 'sales', label: 'Rapport des ventes', icon: TrendingUp },
    { value: 'customers', label: 'Rapport clients', icon: Users },
    { value: 'products', label: 'Rapport produits', icon: Package },
    { value: 'orders', label: 'Rapport commandes', icon: ShoppingCart }
  ];

  const generatePDFReport = () => {
    const reportData = {
      type: reportType,
      dateRange,
      startDate,
      endDate,
      stats,
      recentOrders: recentOrders?.slice(0, 10),
      topProducts: topProducts?.slice(0, 10),
      generatedAt: new Date().toLocaleString('fr-FR')
    };

    const pdfContent = `
RAPPORT BESHOPPING - ${reportTypes.find(r => r.value === reportType)?.label.toUpperCase()}
Généré le: ${reportData.generatedAt}
Période: ${dateRange === 'custom' ? `${startDate} - ${endDate}` : dateRange}

=== STATISTIQUES GÉNÉRALES ===
Revenus totaux: ${formatCurrency(stats?.totalRevenue || 0)}
Commandes totales: ${stats?.totalOrders || 0}
Commandes aujourd'hui: ${stats?.todayOrders || 0}

${reportType === 'orders' && recentOrders ? `
=== COMMANDES RÉCENTES ===
${recentOrders.slice(0, 10).map(order => 
  `${order.order_number} - ${order.customer_name} - ${formatCurrency(order.total_amount)} - ${order.status}`
).join('\n')}
` : ''}

${reportType === 'products' && topProducts ? `
=== PRODUITS LES PLUS VENDUS ===
${topProducts.slice(0, 10).map(product => 
  `${product.product_name} - Qté: ${product.total_quantity} - Revenus: ${formatCurrency(product.total_revenue)}`
).join('\n')}
` : ''}

---
Rapport généré par BeShopping Admin
    `.trim();

    const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport_${reportType}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Rapport PDF généré",
      description: "Le rapport a été téléchargé avec succès",
    });
  };

  const generateCSVReport = () => {
    let csvContent = '';
    
    if (reportType === 'orders' && recentOrders) {
      csvContent = 'Numéro,Client,Montant,Statut,Date\n';
      csvContent += recentOrders.slice(0, 100).map(order => 
        `"${order.order_number}","${order.customer_name}","${order.total_amount}","${order.status}","${formatDate(order.created_at)}"`
      ).join('\n');
    } else if (reportType === 'products' && topProducts) {
      csvContent = 'Produit,Quantité vendue,Revenus,Nb commandes\n';
      csvContent += topProducts.slice(0, 100).map(product => 
        `"${product.product_name}","${product.total_quantity}","${product.total_revenue}","${product.order_count}"`
      ).join('\n');
    } else {
      csvContent = 'Type,Valeur\n';
      csvContent += `"Revenus totaux","${stats?.totalRevenue || 0}"\n`;
      csvContent += `"Commandes totales","${stats?.totalOrders || 0}"\n`;
      csvContent += `"Commandes aujourd'hui","${stats?.todayOrders || 0}"\n`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport_${reportType}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Rapport CSV généré",
      description: "Le rapport a été téléchargé avec succès",
    });
  };

  if (isLoading) {
    return <AdminLoader />;
  }

  return (
    <div className="space-y-4 p-4 pb-24 md:pb-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate">
            Rapports
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            Générez et exportez des rapports détaillés
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={generateCSVReport} size="sm">
            CSV
          </Button>
          <Button onClick={generatePDFReport} size="sm">
            <FileText className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="reportType" className="text-sm">Type de rapport</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span className="truncate">{type.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="dateRange" className="text-sm">Période</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Aujourd'hui</SelectItem>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                  <SelectItem value="quarter">Ce trimestre</SelectItem>
                  <SelectItem value="year">Cette année</SelectItem>
                  <SelectItem value="custom">Personnalisé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {dateRange === 'custom' && (
              <>
                <div>
                  <Label htmlFor="startDate" className="text-sm">Date de début</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="endDate" className="text-sm">Date de fin</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium truncate">Revenus totaux</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{formatCurrency(stats?.totalRevenue || 0)}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
        
        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium truncate">Commandes</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{stats?.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground">
              +180.1% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
        
        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium truncate">Produits vendus</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">
              {topProducts?.reduce((sum, product) => sum + product.total_quantity, 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +19% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
        
        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium truncate">Taux de conversion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">2.4%</div>
            <p className="text-xs text-muted-foreground">
              +0.4% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Report Content */}
      <div className="min-w-0 overflow-x-auto">
        {reportType === 'sales' && (
          <Card>
            <CardHeader>
              <CardTitle>Rapport des ventes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[100px]">Date</TableHead>
                      <TableHead className="min-w-[100px]">Commandes</TableHead>
                      <TableHead className="min-w-[120px]">Revenus</TableHead>
                      <TableHead className="min-w-[140px]">Moyenne par commande</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>{formatDate(new Date().toISOString())}</TableCell>
                      <TableCell>{stats?.todayOrders || 0}</TableCell>
                      <TableCell>{formatCurrency(stats?.totalRevenue || 0)}</TableCell>
                      <TableCell>
                        {formatCurrency(stats?.totalOrders ? (stats.totalRevenue / stats.totalOrders) : 0)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {reportType === 'products' && (
          <Card>
            <CardHeader>
              <CardTitle>Produits les plus vendus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Produit</TableHead>
                      <TableHead className="min-w-[120px]">Quantité vendue</TableHead>
                      <TableHead className="min-w-[120px]">Revenus</TableHead>
                      <TableHead className="min-w-[120px]">Nb commandes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProducts?.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{product.product_name}</TableCell>
                        <TableCell>{product.total_quantity}</TableCell>
                        <TableCell>{formatCurrency(product.total_revenue)}</TableCell>
                        <TableCell>{product.order_count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {reportType === 'orders' && (
          <Card>
            <CardHeader>
              <CardTitle>Commandes récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Numéro</TableHead>
                      <TableHead className="min-w-[150px]">Client</TableHead>
                      <TableHead className="min-w-[120px]">Montant</TableHead>
                      <TableHead className="min-w-[100px]">Statut</TableHead>
                      <TableHead className="min-w-[120px]">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders?.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.order_number}</TableCell>
                        <TableCell>{order.customer_name}</TableCell>
                        <TableCell>{formatCurrency(order.total_amount)}</TableCell>
                        <TableCell>
                          <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(order.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {reportType === 'customers' && (
          <Card>
            <CardHeader>
              <CardTitle>Analyse des clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Rapport clients en cours de développement</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminReports;
