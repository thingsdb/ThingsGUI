`set_${category}("${name}", {${properties.map(v=>`${v.propertyName}: ${category=='type'?`'${v.propertyType||v.definition}'`:`${v.propertyVal}`}`)}})`


`set_${category}("${name}", {${properties.map(v=>`${v.propertyName}: ${var}`)}})`         '${v.propertyType}'

`set_${category}("${name}", {${properties.map(v=>`${v.propertyName}: ${var}`)}})`         '${v.definition}'

`set_${category}("${name}", {${properties.map(v=>`${v.propertyName}: ${var}`)}})`           ${v.propertyVal}



`mod_${category}('${item.name}', 'add', '${update.propertyName}'${category=='type'?`, '${update.propertyType||update.definition}'`:''}${update.propertyVal?`, ${update.propertyVal}`:''})`

`mod_${category}('${item.name}', 'add', '${update.propertyName}', '${update.propertyType}'${update.propertyVal?`, ${update.propertyVal}`:''})` fields
`mod_${category}('${item.name}', 'add', '${update.propertyName}', '${update.definition}')` methods
`mod_${category}('${item.name}', 'add', '${update.propertyName}', '${update.propertyVal}')` members



`mod_${category}('${item.name}', 'mod', '${update.propertyName}', ${category=='type'?`'${update.propertyType}'`: update.propertyVal})`


`mod_type('${item.name}', 'mod', '${update.propertyName}', '${update.propertyType}'`
`mod_type('${item.name}', 'mod', '${update.propertyName}', '${update.definition}'`
`mod_enum('${item.name}', 'mod', '${update.propertyName}', ${update.propertyVal})`


`mod_type('${item.name}', 'ren', '${name}', '${p.propertyName}')`

`mod_type('${item.name}', 'ren', '${name}', '${p.propertyName}')`
`mod_type('${item.name}', 'ren', '${name}', '${p.propertyName}')`
`mod_type('${item.name}', 'ren', '${name}', '${p.propertyName}')`
