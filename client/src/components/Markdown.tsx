import { PropsWithChildren } from "react";
import ReactMarkdown from "react-markdown";

export const Markdown = (props: PropsWithChildren) => {
	return (
		<div className="job-description text-start mt-3">
			<ReactMarkdown>
				{typeof props.children === "string"
					? props.children
					: "No description provided"}
			</ReactMarkdown>
		</div>
	);
};
