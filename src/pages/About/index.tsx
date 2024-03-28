import { useNavigate } from "react-router-dom";

export default function AboutPage() {
  const navigator = useNavigate();
  return (
    <div>
      <div className="bg-blue-100 text-2xl text-white p-4">
        this is a AboutPage
      </div>

      <button
        onClick={() => {
          navigator("/");
        }}
      >
        切换页面
      </button>
    </div>
  );
}
