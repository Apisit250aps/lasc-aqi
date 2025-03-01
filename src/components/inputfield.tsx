interface InputfieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function InputLabel({ label, ...props }: InputfieldProps) {
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">{label}</legend>
      <input
        type="text"
        {...props}
        className="input w-full"
       
      />
    </fieldset>
  )
}
