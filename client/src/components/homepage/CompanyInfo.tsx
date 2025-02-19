import { Company } from "@/model/Job";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "../ui/card";

interface CompanyInfoProps {
	company: Company;
}

function CompanyInfo({ company }: CompanyInfoProps) {
	return (
		<Card className="mt-4">
			<CardHeader className="text-start flex flex-row gap-2 px-6 pt-6 pb-2">
				<div>
					<CardTitle className="text-[22px] transition-colors duration-300 group-hover:text-blue-300">
						About the company
					</CardTitle>
					<CardDescription className="flex gap-1">
						<img
							src={company.logo}
							className="mt-2 w-[70px] h-[70px] border-[1px] border-gray-200 rounded-md object-contain"
						/>

						<div className="mt-2">
							<p>{company.name}</p>
							<p>{company.location}</p>
						</div>
					</CardDescription>
				</div>
			</CardHeader>

			<CardContent className="text-start ">
				<p className="text-[14px] mt-2">{company.description}</p>
			</CardContent>
		</Card>
	);
}

export default CompanyInfo;
