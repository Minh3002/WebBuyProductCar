import { useState, useEffect } from 'react';
import { Laptop, Smartphone, Search, RefreshCw, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export default function DeviceManager() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filterDate, setFilterDate] = useState('');

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const url = `/admin/access-logs?page=${page}&limit=10${filterDate ? `&date=${filterDate}` : ''}`;
      const res = await axiosClient.get(url);
      setLogs(res.data);
      setTotalPages(res.totalPages || 1);
      setTotalItems(res.total || 0);
    } catch (err) {
      console.error('Error fetching access logs', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, filterDate]);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lượt truy cập này?')) {
      try {
        await axiosClient.delete(`/admin/access-logs/${id}`);
        fetchLogs();
      } catch (err) {
        console.error('Failed to delete log', err);
      }
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Hành động này sẽ xóa TOÀN BỘ lịch sử truy cập của hệ thống. Bạn có chắc chắn không?')) {
      try {
        await axiosClient.delete('/admin/access-logs/clear-all');
        setPage(1);
        fetchLogs();
      } catch (err) {
        console.error('Failed to clear logs', err);
      }
    }
  };

  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(logs.map(log => log._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} mục đã chọn không?`)) {
      try {
        await axiosClient.post('/admin/access-logs/bulk-delete', { ids: selectedIds });
        setSelectedIds([]);
        fetchLogs();
      } catch (err) {
        console.error('Failed to bulk delete', err);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
        <h3 className="font-bold text-lg text-gray-800">Chi tiết thiết bị & vị trí truy cập</h3>
        <div className="flex gap-3 items-center">
          {selectedIds.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              className="px-3 py-1.5 bg-red-600 text-white font-semibold text-sm rounded hover:bg-red-700 transition-colors shadow-sm flex items-center gap-1"
            >
              <Trash2 size={16} />
              Xóa mục đã chọn ({selectedIds.length})
            </button>
          )}
          <div className="px-3 py-1.5 bg-brand-dark text-white rounded text-sm font-bold shadow-sm">
            TẤT CẢ THIẾT BỊ
          </div>
          <input 
            type="date" 
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1.5 text-sm"
          />
          <button 
            onClick={handleClearAll}
            className="px-3 py-1.5 bg-red-500 text-white font-semibold text-sm rounded hover:bg-red-600 transition-colors shadow-sm"
            title="Xóa tất cả"
          >
            Xóa tất cả
          </button>
          <button 
            onClick={() => { setPage(1); fetchLogs(); setSelectedIds([]); }}
            className="p-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            title="Làm mới"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm">
              <th className="p-3 border-b text-center w-10">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 cursor-pointer"
                  checked={logs.length > 0 && selectedIds.length === logs.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-3 border-b font-semibold text-center w-12">Loại</th>
              <th className="p-3 border-b font-semibold">Thiết bị / OS / Trình duyệt</th>
              <th className="p-3 border-b font-semibold">Địa chỉ IP</th>
              <th className="p-3 border-b font-semibold">Vị trí</th>
              <th className="p-3 border-b font-semibold">Người dùng</th>
              <th className="p-3 border-b font-semibold">Nguồn</th>
              <th className="p-3 border-b font-semibold text-right">Thời gian</th>
              <th className="p-3 border-b font-semibold text-center w-16">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="10" className="p-8 text-center text-gray-500">Đang tải dữ liệu...</td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan="10" className="p-8 text-center text-gray-500">Không có dữ liệu truy cập</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id} className={`border-b hover:bg-gray-50 text-sm ${selectedIds.includes(log._id) ? 'bg-blue-50/50' : ''}`}>
                  <td className="p-3 text-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 cursor-pointer"
                      checked={selectedIds.includes(log._id)}
                      onChange={() => handleSelectRow(log._id)}
                    />
                  </td>
                  <td className="p-3 text-center text-gray-500">
                    {log.deviceType === 'Mobile' ? <Smartphone size={20} className="mx-auto" /> : <Laptop size={20} className="mx-auto" />}
                  </td>
                  <td className="p-3">
                    <p className="font-bold text-gray-800">{log.browser}</p>
                    <p className="text-xs text-gray-500">{log.os} • {log.deviceType}</p>
                  </td>
                  <td className="p-3">
                    <p className="font-mono text-gray-700">{log.ip}</p>
                    <p className="text-xs text-gray-500">{log.isp || 'N/A'}</p>
                  </td>
                  <td className="p-3 text-gray-700">
                    {log.location}
                  </td>
                  <td className="p-3">
                    <p className="font-bold text-gray-800 line-clamp-1">{log.userName}</p>
                    {log.userRole && (
                      <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        log.userRole === 'Admin' ? 'bg-red-100 text-red-700' :
                        log.userRole === 'Customer' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {log.userRole}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-gray-600">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs border">
                      {log.entrySource}
                    </span>
                  </td>
                  <td className="p-3 text-right text-gray-500 text-xs">
                    {new Date(log.createdAt).toLocaleString('vi-VN')}
                  </td>
                  <td className="p-3 text-center">
                    <button 
                      onClick={() => handleDelete(log._id)}
                      className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                      title="Xóa"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-200 flex justify-between items-center bg-gray-50 rounded-b-lg">
        <div className="text-sm text-gray-600 font-medium">
          Tổng cộng: <span className="font-bold text-brand-dark">{totalItems}</span> thiết bị
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Trang {page} / {totalPages}</span>
          <div className="flex gap-1">
            <button 
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="p-1 border rounded bg-white text-gray-600 disabled:opacity-50 hover:bg-gray-50"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="p-1 border rounded bg-white text-gray-600 disabled:opacity-50 hover:bg-gray-50"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
