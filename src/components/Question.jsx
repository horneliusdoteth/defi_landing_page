export default function Question({ text, type, options, value, onChange }) {
    return (
      <div>
        <p className="mb-3 text-gray-200">{text}</p>
        {type === 'buttons' ? (
          <div className="flex flex-wrap gap-2">
            {options.map(opt => (
              <button
                key={opt}
                onClick={() => onChange(opt)}
                className={`
                  px-4 py-2 border rounded
                  ${value===opt
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-gray-700 text-gray-200 border-gray-600'}
                `}
              >{opt}</button>
            ))}
          </div>
        ) : (
          <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 placeholder-gray-400"
          />
        )}
      </div>
    )
  }
  