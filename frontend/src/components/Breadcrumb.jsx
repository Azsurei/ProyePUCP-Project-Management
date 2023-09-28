import React from "react";
import Link from "next/link";

function Breadcrumbs({ children }) {
    const items = React.Children.toArray(children);

    return (
        <ol className="list-none p-0 inline-flex">
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    {item}
                    {index < items.length - 1 && (
                        <span className="text-gray-500 mr-2">/</span>
                    )}
                </React.Fragment>
            ))}
        </ol>
    );
}

function BreadcrumbsItem({ href, text }) {
    return (
        <li className="mr-2">
            {href ? (
                <Link href={href} className="text-gray-500 hover:text-gray-700">
                    {text}
                </Link>
            ) : (
                <span className="text-gray-500">{text}</span>
            )}
        </li>
    );
}

export { Breadcrumbs, BreadcrumbsItem };
