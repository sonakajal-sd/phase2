type BadgeProps={
    label:string
    status:'active'| 'pending'|'completed';
};

function Badge({label , status}:BadgeProps){
    return(
        <span className={`badge badge-${status}`}>
            {label}
        </span>
    );
}

export default Badge;