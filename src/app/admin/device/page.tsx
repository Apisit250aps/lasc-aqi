'use client'

import { InputLabel } from '@/components/inputfield'
import { closeModal, DialogModal, openModal } from '@/components/modals'
import { IDevice } from '@/models'
import { IPagination, IResponse } from '@/types/types'
import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import Swal from 'sweetalert2'

export default function AdminDevicePage() {
  const [deviceData, setDeviceData] = useState<IDevice[]>([])
  const [device, setDevice] = useState<IDevice>({} as IDevice)
  const [formEdit, setFormEdit] = useState(false)
  const loadDeviceData = useCallback(async (): Promise<void> => {
    try {
      const response = await axios.get<
        IResponse<IDevice[]> & { pagination?: IPagination }
      >('/api/device')
      const { data } = response.data
      setDeviceData(data!)
    } catch (error) {
      console.error(error)
    }
  }, [])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = event.target

    setDevice((prevItem) => ({
      ...prevItem,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }))
  }

  const onEdit = (device: IDevice) => {
    setDevice(device)
    openModal('device-modal')
    setFormEdit(true)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      if (device._id) {
        const response = await axios.put<IResponse>(
          `/api/device/${device._id}`,
          device
        )
        if (response.data.success) {
          loadDeviceData()
          closeModal('device-modal')
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: response.data.message
          })
        }
      } else {
        const response = await axios.post<IResponse>('/api/device', device)
        if (response.data.success) {
          loadDeviceData()
          closeModal('device-modal')
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: response.data.message
          })
        }
      }
      setDevice({} as IDevice)
    } catch (error) {
      console.error(error)
    } finally {
      setFormEdit(false)
    }
  }

  useEffect(() => {
    loadDeviceData()
  }, [loadDeviceData])

  return (
    <>
      <DialogModal id={'device-modal'}>
        <h3>{formEdit ? <>Edit</> : <>New</>} Device</h3>
        <form onSubmit={handleSubmit}>
          <InputLabel
            label={'Name'}
            placeholder="Device name"
            onChange={handleInputChange}
            value={device.name || ''}
            name="name"
          />
          <InputLabel
            label={'Location'}
            placeholder="Device location"
            onChange={handleInputChange}
            name="location"
            value={device.location || ''}
          />
          <div className="flex justify-end mt-3">
            <button type="submit" className="btn btn-primary">
              {formEdit ? <>Edit</> : <>Add</>}
            </button>
          </div>
        </form>
      </DialogModal>
      <div className="card">
        <div className="card-body">
          <div className="card-title flex justify-between">
            <h2>Devices</h2>
            <div className="card-actions">
              <button
                className="btn btn-primary"
                onClick={() => openModal('device-modal')}
              >
                Add Device
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th>#</th>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>LOCATION</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                {deviceData.map((device, index) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{device._id}</td>
                    <td>{device.name}</td>
                    <td>{device.location}</td>
                    <td>
                      <div className="dropdown dropdown-end">
                        <div
                          tabIndex={0}
                          role="button"
                          className="btn m-1 btn-sm"
                        >
                          <i className="bx bx-dots-vertical-rounded"></i>
                        </div>
                        <ul
                          tabIndex={0}
                          className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                        >
                          <li>
                            <a onClick={() => onEdit(device)}>
                              <i className="bx bx-pencil"></i> Edit
                            </a>
                          </li>
                          <li>
                            <a>
                              <i className="bx bx-trash"></i> Delete
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
