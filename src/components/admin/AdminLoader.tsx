import './AdminLoader.css';

export default function AdminLoader() {
  return (
    <div className="admin-loader-wrapper">
      <div className="admin-loader-dots">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={`admin-loader-dot admin-loader-dot-${i + 1}`}></div>
        ))}
      </div>
    </div>
  );
} 