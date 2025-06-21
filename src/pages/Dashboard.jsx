import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building2, 
  FolderOpen, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  Package,
  FileText,
  DollarSign,
  Clock
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { token } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/relatorios/dashboard-geral', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data.dashboard);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout currentPage="dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const stats = dashboardData ? [
    {
      title: 'Total de Secretarias',
      value: dashboardData.estatisticas_gerais.total_secretarias.toString(),
      description: 'Secretarias ativas',
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Projetos Ativos',
      value: dashboardData.estatisticas_gerais.projetos_em_execucao.toString(),
      description: 'Em execução',
      icon: FolderOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Projetos Concluídos',
      value: dashboardData.estatisticas_gerais.projetos_concluidos.toString(),
      description: 'Finalizados',
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      title: 'Projetos Atrasados',
      value: dashboardData.estatisticas_gerais.projetos_atrasados.toString(),
      description: 'Requerem atenção',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ] : [];

  // Cores para os gráficos
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Dados para gráfico de status
  const statusData = dashboardData?.projetos_por_status.map((item, index) => ({
    ...item,
    color: COLORS[index % COLORS.length]
  })) || [];

  // Dados para gráfico de secretarias
  const secretariaData = dashboardData?.projetos_por_secretaria || [];

  // Dados simulados para gráfico de linha (gastos mensais)
  const gastosData = [
    { mes: 'Jan', valor: 3200 },
    { mes: 'Fev', valor: 2800 },
    { mes: 'Mar', valor: 3500 },
    { mes: 'Abr', valor: 4070 },
    { mes: 'Mai', valor: 3800 },
    { mes: 'Jun', valor: 4200 }
  ];

  const recentActivities = [
    {
      title: 'Projeto "Reforma das Escolas" atualizado',
      description: 'Progresso: 65% → 70%',
      time: '2 horas atrás',
      type: 'update',
      icon: TrendingUp
    },
    {
      title: 'Nova conta registrada',
      description: 'Energia elétrica - R$ 2.500,00',
      time: '4 horas atrás',
      type: 'expense',
      icon: DollarSign
    },
    {
      title: 'Material recebido',
      description: '50 resmas de papel A4',
      time: '1 dia atrás',
      type: 'material',
      icon: Package
    },
    {
      title: 'Relatório trimestral gerado',
      description: 'Secretaria de Educação',
      time: '2 dias atrás',
      type: 'report',
      icon: FileText
    }
  ];

  return (
    <Layout currentPage="dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral do sistema de gestão</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-sm text-gray-500">
                        {stat.description}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status dos Projetos - Gráfico de Pizza */}
          <Card>
            <CardHeader>
              <CardTitle>Status dos Projetos</CardTitle>
              <CardDescription>
                Distribuição dos projetos por status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, total }) => `${status}: ${total}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="total"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Projetos por Secretaria - Gráfico de Barras */}
          <Card>
            <CardHeader>
              <CardTitle>Projetos por Secretaria</CardTitle>
              <CardDescription>
                Número de projetos por secretaria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={secretariaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="secretaria" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      fontSize={12}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Segunda linha de gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gastos Mensais - Gráfico de Linha */}
          <Card>
            <CardHeader>
              <CardTitle>Gastos Mensais</CardTitle>
              <CardDescription>
                Evolução dos gastos da Secretaria de Governo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={gastosData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`R$ ${value.toLocaleString()}`, 'Gastos']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="valor" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Atividades Recentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Atividades Recentes</span>
              </CardTitle>
              <CardDescription>
                Últimas atualizações do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {recentActivities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Icon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alertas */}
        {dashboardData?.alertas && dashboardData.alertas.length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-orange-800">
                <AlertTriangle className="h-5 w-5" />
                <span>Alertas Importantes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.alertas.map((alerta, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg border border-orange-200">
                    <p className="text-sm font-medium text-orange-900">
                      {alerta.mensagem}
                    </p>
                    {alerta.valor && (
                      <p className="text-xs text-orange-700 mt-1">
                        Valor: R$ {alerta.valor.toLocaleString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Banner */}
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Sistema Funcionando</h3>
                <p className="text-blue-100">
                  Todos os serviços estão operacionais. Última atualização: hoje às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
                {dashboardData && (
                  <p className="text-blue-100 mt-1">
                    Taxa de conclusão de projetos: {dashboardData.estatisticas_gerais.taxa_conclusao}%
                  </p>
                )}
              </div>
              <CheckCircle className="h-8 w-8 text-green-300" />
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;

