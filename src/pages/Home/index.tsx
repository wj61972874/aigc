import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigator = useNavigate();
  return (
    <div>
      <div className="bg-blue-500 text-2xl text-white p-4">
        this is a HomePage
      </div>

      <button
        onClick={() => {
          navigator("/about");
        }}
      >
        切换页面
      </button>
    </div>
  );
}
