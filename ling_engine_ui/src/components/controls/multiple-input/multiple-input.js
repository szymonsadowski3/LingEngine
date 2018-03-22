import TagsInput from 'react-tagsinput'

import 'react-tagsinput/react-tagsinput.css' // If using WebPack and style-loader.

export class MultipleInput extends React.Component {
    constructor() {
        super();
        this.state = {tags: []}

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(tags) {
        this.setState({tags})
    }

    render() {
        return <TagsInput
            value={this.state.tags}
            onChange={this.handleChange}
            inputProps={{
                className: 'react-tagsinput-input',
                placeholder: 'Add letter'
            }}
            className="react-tagsinput"
        />
    }
}