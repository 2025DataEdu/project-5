
import { PopularRegulations } from "@/components/PopularRegulations";
import { mockPopularRegulations } from "@/data/mockData";

export const PopularTabContent = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <PopularRegulations 
        popularItems={mockPopularRegulations}
        department="전체"
      />
      <PopularRegulations 
        popularItems={mockPopularRegulations.filter(item => item.department === "인사팀")}
        department="인사팀"
      />
    </div>
  );
};
