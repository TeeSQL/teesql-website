import Comparison from "./comparison";
import Reveal from "./reveal";

export default function ComparisonSection() {
  return (
    <Reveal>
      <div className="max-w-[860px] mx-auto px-6 mt-4">
        <Comparison />
      </div>
    </Reveal>
  );
}
