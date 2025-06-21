import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit, 
  Eye,
  Phone,
  Mail,
  User
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Secretarias = () => {
  const { token } = useAuth();
  const [secretarias, setSecretarias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSecretaria, setEditingSecretaria] = useState(null);

  const [formData, setFormData] = useState({
    nome: '',
    responsavel: '',
    contato: '',
    email: '',
    telefone: ''
  });

  useEffect(() => {
    fetchSecretarias();
  }, []);

  const fetchSecretarias = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/secretarias', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSecretarias(data.secretarias);
      }
    } catch (error) {
      console.error('Erro ao carregar secretarias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui seria implementada a lógica de salvar/editar
    console.log('Dados do formulário:', formData);
    setShowForm(false);
    setEditingSecretaria(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      responsavel: '',
      contato: '',
      email: '',
      telefone: ''
    });
  };

  const handleEdit = (secretaria) => {
    setEditingSecretaria(secretaria);
    setFormData({
      nome: secretaria.nome,
      responsavel: secretaria.responsavel,
      contato: secretaria.contato,
      email: secretaria.email,
      telefone: secretaria.telefone
    });
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingSecretaria(null);
    resetForm();
    setShowForm(true);
  };

  const filteredSecretarias = secretarias.filter(secretaria =>
    secretaria.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    secretaria.responsavel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Layout currentPage="secretarias">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando secretarias...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="secretarias">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Secretarias</h1>
            <p className="text-gray-600">Gerenciamento das secretarias municipais</p>
          </div>
          <Button onClick={handleNew} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Nova Secretaria</span>
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar por nome da secretaria ou responsável..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Form Modal */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingSecretaria ? 'Editar Secretaria' : 'Nova Secretaria'}
              </CardTitle>
              <CardDescription>
                {editingSecretaria 
                  ? 'Atualize as informações da secretaria' 
                  : 'Preencha os dados da nova secretaria'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome da Secretaria</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      placeholder="Ex: Secretaria de Educação"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="responsavel">Responsável</Label>
                    <Input
                      id="responsavel"
                      value={formData.responsavel}
                      onChange={(e) => setFormData({...formData, responsavel: e.target.value})}
                      placeholder="Nome do responsável"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="email@secretaria.gov.br"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                      placeholder="(11) 3333-4444"
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="contato">Contato Adicional</Label>
                    <Input
                      id="contato"
                      value={formData.contato}
                      onChange={(e) => setFormData({...formData, contato: e.target.value})}
                      placeholder="Informações adicionais de contato"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowForm(false);
                      setEditingSecretaria(null);
                      resetForm();
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingSecretaria ? 'Atualizar' : 'Salvar'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Secretarias List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSecretarias.map((secretaria) => (
            <Card key={secretaria.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{secretaria.nome}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {secretaria.ativa ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{secretaria.responsavel}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{secretaria.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{secretaria.telefone}</span>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(secretaria)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Navegar para página de detalhes/projetos
                      window.location.href = `/secretarias/${secretaria.id}/projetos`;
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Projetos
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSecretarias.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma secretaria encontrada
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? 'Tente ajustar os termos de busca.' 
                  : 'Comece criando uma nova secretaria.'
                }
              </p>
              {!searchTerm && (
                <Button onClick={handleNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar primeira secretaria
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Secretarias</p>
                  <p className="text-3xl font-bold text-gray-900">{secretarias.length}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Secretarias Ativas</p>
                  <p className="text-3xl font-bold text-green-600">
                    {secretarias.filter(s => s.ativa).length}
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Média de Projetos</p>
                  <p className="text-3xl font-bold text-purple-600">3.2</p>
                  <p className="text-sm text-gray-500">por secretaria</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-full">
                  <Building2 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Secretarias;

