import { useEffect, useState } from 'react';
import { getTemplates, deleteTemplate } from '../../../services/apiService';
import { FileText, Eye, ArrowLeft, Plus, Trash2, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Pagination } from '../../../components/ui/Pagination';
import { useDebounce } from '../../../hooks/useDebounce';
import { Skeleton } from '../../../components/ui/Skeleton';

export default function AllTemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const navigate = useNavigate();

  const debouncedSearch = useDebounce(search, 500);

  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTemplates({
        p: page,
        n: pageSize,
        search: debouncedSearch,
        sortBy,
        order,
      });
      setTemplates(data.data || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError('Failed to fetch templates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
    // eslint-disable-next-line
  }, [page, pageSize, debouncedSearch, sortBy, order]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('asc');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    await deleteTemplate(id);
    fetchTemplates();
  };

  return (
    <div className="min-h-screen py-10 px-2 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="mx-auto w-full max-w-5xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 shadow transition-all backdrop-blur-md"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-semibold">Back</span>
        </button>
        <div className="flex items-center gap-2 mb-6 justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">All Templates</h1>
          </div>
          <Button
            variant="primary"
            size="sm"
            className="flex items-center gap-2 px-4 py-2 rounded-lg shadow bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-700 dark:to-purple-800 dark:hover:from-blue-800 dark:hover:to-purple-900 text-white font-semibold"
            onClick={() => navigate('/templates/create')}
          >
            <Plus className="h-4 w-4" />
            Create New Template
          </Button>
        </div>
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={e => { setPage(1); setSearch(e.target.value); }}
            className="w-full sm:w-64 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-500 dark:text-gray-400">Total: {total}</span>
        </div>
        {loading ? (
          <div className="overflow-x-auto rounded-xl shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900">
                  <th className="px-4 py-3" colSpan={5}>
                    <Skeleton className="h-6 w-1/3 mx-auto" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...Array(6)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3"><Skeleton className="h-5 w-20" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-5 w-16" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-5 w-16" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-5 w-12" /></td>
                    <td className="px-4 py-3 text-center"><Skeleton className="h-5 w-8 mx-auto" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500 dark:text-red-400">{error}</div>
        ) : templates.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">No templates found.</div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase cursor-pointer" onClick={() => handleSort('name')}>
                      Name {sortBy === 'name' && (order === 'asc' ? '▲' : '▼')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase cursor-pointer" onClick={() => handleSort('description')}>
                      Description {sortBy === 'description' && (order === 'asc' ? '▲' : '▼')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase cursor-pointer" onClick={() => handleSort('createdAt')}>
                      Date {sortBy === 'createdAt' && (order === 'asc' ? '▲' : '▼')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Preview</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {templates.map((tpl) => (
                    <tr key={tpl._id} className="hover:bg-blue-50 dark:hover:bg-gray-800/60 transition-all">
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 rounded  dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium text-xs">
                          {tpl.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300 text-xs">{tpl.description}</td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">{new Date(tpl.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="rounded border p-2" style={{ fontFamily: tpl.style?.fontFamily, background: tpl.style?.background, color: tpl.style?.color, border: tpl.style?.border }}>{tpl.name}</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-green-100 dark:hover:bg-green-900 ml-1"
                          onClick={() => navigate(`/template-edit/${tpl._id}`)}
                          title="Edit Template"
                        >
                          <Edit2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-red-100 dark:hover:bg-red-900 ml-1"
                          onClick={() => handleDelete(tpl._id)}
                          title="Delete Template"
                        >
                          <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(total / pageSize)}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
} 