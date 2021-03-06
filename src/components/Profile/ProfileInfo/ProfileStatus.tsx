import React, { ChangeEvent } from 'react';

type PropsType = {
    status: string
    updateStatus: (status: string) => void
}
type StateType = {
    editMode: boolean
    status: string
}

class ProfileStatus extends React.Component<PropsType, StateType> {
    state = {
        editMode: false,
        status: this.props.status
    }

    activeEditMode = () => {
        this.setState({editMode:true})               
    }
    deActiveEditMode  = () => {
        this.setState({editMode:false})
        this.props.updateStatus(this.state.status)               
    }
    onStatusChange = (e:ChangeEvent<HTMLInputElement>) => {
        this.setState({
            status: e.currentTarget.value         
        })
    }
    componentDidUpdate (prevProps: PropsType, prevState: StateType) {
        if(prevProps.status !== this.props.status) {   
            this.setState({
                status:this.props.status
            })
        }
    }

    render() {
        return (
            <div>
                {!this.state.editMode &&        
                    <div>
                        <span onDoubleClick={this.activeEditMode}>{this.state.status || 'No status'}</span>
                    </div>
                }
                {this.state.editMode &&
                    <div>
                        <input onChange={this.onStatusChange} autoFocus={true} onBlur={this.deActiveEditMode}  value={this.state.status}  />
                    </div>
                }
            </div>
        )
    }
}

export default ProfileStatus;