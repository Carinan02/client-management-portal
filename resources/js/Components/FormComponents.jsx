export function FormField({ label, error, required, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {children}
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}

export function Input({ className = '', ...props }) {
    return (
        <input
            className={`block w-full rounded-lg border-gray-300 shadow-sm
                focus:border-indigo-500 focus:ring-indigo-500 text-sm ${className}`}
            {...props}
        />
    );
}

export function Select({ children, className = '', ...props }) {
    return (
        <select
            className={`block w-full rounded-lg border-gray-300 shadow-sm
                focus:border-indigo-500 focus:ring-indigo-500 text-sm ${className}`}
            {...props}
        >
            {children}
        </select>
    );
}

export function Textarea({ className = '', ...props }) {
    return (
        <textarea
            rows={4}
            className={`block w-full rounded-lg border-gray-300 shadow-sm
                focus:border-indigo-500 focus:ring-indigo-500 text-sm ${className}`}
            {...props}
        />
    );
}

export function PrimaryButton({ disabled, children, ...props }) {
    return (
        <button
            type="submit"
            disabled={disabled}
            className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg
                hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            {...props}
        >
            {children}
        </button>
    );
}
