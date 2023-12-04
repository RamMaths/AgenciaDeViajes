import { InputGroup } from 'react-bootstrap';

import { useManagementContext } from '../Management';

const Checkbox = ({id_element}) => {
  const {
    deletions
  } = useManagementContext();

  const handleChange = (event) => {
    if(event.target.checked) {
      deletions.current.set(id_element);
    } else {
      deletions.current.delete(id_element);
    }
  };

  return (
    <div>
      <InputGroup>
        <InputGroup.Checkbox onChange={(event) => handleChange(event)}/>
      </InputGroup>
    </div>
  )
}

export default Checkbox;
