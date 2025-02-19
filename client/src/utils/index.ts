import Job, { Company } from "@/model/Job";
import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
    differenceInMinutes,
    differenceInHours,
    differenceInDays,
} from "date-fns"
export const queryClient = new QueryClient()

if (import.meta.env.VITE_SERVER_URL?.endsWith("/")) {
	import.meta.env.VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL.slice(
		0,
		-1
	);
}
export const serverURL =
	import.meta.env.VITE_SERVER_URL || "http://localhost:8080";
export const url = serverURL + "/api";

export const axiosInstance = axios.create({
	withCredentials: true,
	baseURL: url
});

// let refreshTokenPromise: Promise<void> | null = null;

// axiosInstance.interceptors.response.use(
// 	(response) => response,
// 	async (error) => {
// 		const { config, response } = error;

// 		if (config && response?.status === 403) {
// 			console.log("Refreshing token");

// 			if (!refreshTokenPromise) {
// 				refreshTokenPromise = axiosInstance
// 					.post("/auth/refresh-token")
// 					.then(() => {
// 						refreshTokenPromise = null;
// 					});
// 			}

// 			await refreshTokenPromise;

// 			return axiosInstance(config);
// 		}

// 		return Promise.reject(error);
// 	}
// );

export const dateFormat = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0")
    const month = date.toLocaleString("en-US", { month: "long" })
    const year = date.getFullYear()

    return `${day} ${month}, ${year}`
}

export const dateFormatter = (date: Date) => {
    const today = new Date()

    const getFormattedDate = () => {
        const diffInMinutes = differenceInMinutes(today, date)
        const diffInHours = differenceInHours(today, date)
        const diffInDays = differenceInDays(today, date)

        if (diffInMinutes < 60) {
            return `${diffInMinutes} minute${
                diffInMinutes === 1 ? "" : "s"
            } ago`
        } else if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`
        } else {
            return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`
        }
    }

    return getFormattedDate()
}

export const generateMockJobs = (count: number): Job[] => {
	const jobs: Job[] = [];

	for (let i = 1; i <= count; i++) {
		const company: Company = {
			name: `Company ${i}`,
			description: `This is a description of Company ${i}, known for excellence in their field.`,
			logo: `https://via.placeholder.com/150?text=Logo+${i}`,
			url: `https://company${i}.com`,
			location: `Location ${i}`
		};

		const job = new Job(
			`${i}`, // _id
			company, // company
			`Job Title ${i}`, // title
			i % 2 === 0 ? "Full-Time" : "Part-Time", // type
			i % 3 === 0 ? "Intern" : "Senior", // level
			`This is the description for Job Title ${i}. It is a great opportunity for the right candidate.`, // description
			`Location ${i}`, // location
			`$${50 + i * 2}k - $${60 + i * 2}k`, // salary
			`https://company${i}.com/jobs/job${i}`, // url
			`jobs@company${i}.com`, // contactEmail
			[`Skill ${i}`, `Skill ${i + 1}`, `Skill ${i + 2}`], // skills
			new Date(`2023-12-${i < 10 ? `0${i}` : i}`), // datePosted
			new Date(), // createdAt
			new Date(), // updatedAt,
			true
		);

		jobs.push(job);
	}

	return jobs;
};