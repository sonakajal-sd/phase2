type AvatarProps={
    name:string;
}

function Avatar({name}:AvatarProps){
    const initials= name.split(' ')
    .map((part)=>part[0])
    .join('')
    .toUpperCase();

    return(
        <div className="avatar" aria-label="{name}">
            {initials}
        </div>
    );
}

export default Avatar;