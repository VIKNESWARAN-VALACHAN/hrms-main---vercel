import React from 'react'
import { FaChevronDown } from "react-icons/fa";

const LeaveReport = () => {
  return (
    <>
      <div className="flow-root">
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-start sm:justify-end">
            <button className="btn btn-xs sm:btn-sm btn-outline btn-primary">Today</button>
            <button className="btn btn-xs sm:btn-sm btn-outline btn-primary">Yesterday</button>
            <button className="btn btn-xs sm:btn-sm btn-outline btn-primary">
              <span className="hidden sm:inline">This week</span>
              <span className="sm:hidden">Week</span>
            </button>
            <button className="btn btn-xs sm:btn-sm btn-outline btn-primary">
              <span className="hidden sm:inline">Last week</span>
              <span className="sm:hidden">L.Week</span>
            </button>
            <button className="btn btn-xs sm:btn-sm btn-outline btn-primary">
              <span className="hidden sm:inline">This month</span>
              <span className="sm:hidden">Month</span>
            </button>
            <button className="btn btn-xs sm:btn-sm btn-outline btn-primary">
              <span className="hidden sm:inline">Last month</span>
              <span className="sm:hidden">L.Month</span>
            </button>
            <button className="btn btn-xs sm:btn-sm btn-outline btn-primary">
              <span className="hidden sm:inline">This year</span>
              <span className="sm:hidden">Year</span>
            </button>
            <button className="btn btn-xs sm:btn-sm btn-primary">Export</button>
            <button className="btn btn-xs sm:btn-sm btn-primary">
              <span className="hidden sm:inline">Apply Filters</span>
              <span className="sm:hidden">Apply</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-4">
          <div className="form-control">
            <label htmlFor="employee" className="block text-sm font-medium text-gray-900 mb-2">
              Employee
            </label>
            <input
              id="employee"
              name="employee"
              type="text"
              autoComplete="employee"
              className="block w-full rounded-md bg-white px-3 py-2 sm:py-1.5 text-sm sm:text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
            />
          </div>

          <div className="form-control">
            <label htmlFor="employeeno" className="block text-sm font-medium text-gray-900 mb-2">
              <span className="hidden sm:inline">Employee Number</span>
              <span className="sm:hidden">Emp. No.</span>
            </label>
            <input
              id="employeeno"
              name="employeeno"
              type="text"
              autoComplete="employeeno"
              className="block w-full rounded-md bg-white px-3 py-2 sm:py-1.5 text-sm sm:text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
            />
          </div>

          <div className="form-control">
            <label htmlFor="leavefrom" className="block text-sm font-medium text-gray-900 mb-2">
              Leave From
            </label>
            <input
              id="leavefrom"
              name="leavefrom"
              type="text"
              autoComplete="leavefrom"
              className="block w-full rounded-md bg-white px-3 py-2 sm:py-1.5 text-sm sm:text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
            />
          </div>

          <div className="form-control">
            <label htmlFor="leaveto" className="block text-sm font-medium text-gray-900 mb-2">
              Leave To
            </label>
            <input
              id="leaveto"
              name="leaveto"
              type="text"
              autoComplete="leaveto"
              className="block w-full rounded-md bg-white px-3 py-2 sm:py-1.5 text-sm sm:text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-4">
          <div className="form-control">
            <label htmlFor="applyfrom" className="block text-sm font-medium text-gray-900 mb-2">
              Apply From
            </label>
            <input
              id="applyfrom"
              name="applyfrom"
              type="text"
              autoComplete="applyfrom"
              className="block w-full rounded-md bg-white px-3 py-2 sm:py-1.5 text-sm sm:text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
            />
          </div>

          <div className="form-control">
            <label htmlFor="applyto" className="block text-sm font-medium text-gray-900 mb-2">
              Apply To
            </label>
            <input
              id="applyto"
              name="applyto"
              type="text"
              autoComplete="applyto"
              className="block w-full rounded-md bg-white px-3 py-2 sm:py-1.5 text-sm sm:text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
            />
          </div>

          <div className="form-control">
            <label htmlFor="typename" className="block text-sm font-medium text-gray-900 mb-2">
              Type
            </label>
            <div className="relative">
              <select
                id="typename"
                name="typename"
                autoComplete="typename"
                className="w-full appearance-none rounded-md bg-white py-2 sm:py-1.5 pr-8 pl-3 text-sm sm:text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              >
                <option>All</option>
                <option>Development</option>
                <option>HR</option>
                <option>Marketing</option>
              </select>
              <FaChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-500"
              />
            </div>
          </div>

          <div className="form-control">
            <label htmlFor="department" className="block text-sm font-medium text-gray-900 mb-2">
              Department
            </label>
            <div className="relative">
              <select
                id="department"
                name="department"
                autoComplete="department-name"
                className="w-full appearance-none rounded-md bg-white py-2 sm:py-1.5 pr-8 pl-3 text-sm sm:text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              >
                <option>All</option>
                <option>Development</option>
                <option>HR</option>
                <option>Marketing</option>
              </select>
              <FaChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-4">
          <div className="form-control">
            <label htmlFor="benefitlevel" className="block text-sm font-medium text-gray-900 mb-2">
              <span className="hidden sm:inline">Benefit Level</span>
              <span className="sm:hidden">Benefit</span>
            </label>
            <div className="relative">
              <select
                id="benefitlevel"
                name="benefitlevel"
                autoComplete="benefitlevel"
                className="w-full appearance-none rounded-md bg-white py-2 sm:py-1.5 pr-8 pl-3 text-sm sm:text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              >
                <option>All</option>
                <option>Approved</option>
                <option>Pending</option>
                <option>Rejected</option>
              </select>
              <FaChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-500"
              />
            </div>
          </div>

          <div className="form-control">
            <label htmlFor="emergency" className="block text-sm font-medium text-gray-900 mb-2">
              Emergency
            </label>
            <div className="relative">
              <select
                id="emergency"
                name="emergency"
                autoComplete="emergency"
                className="w-full appearance-none rounded-md bg-white py-2 sm:py-1.5 pr-8 pl-3 text-sm sm:text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              >
                <option>All</option>
                <option>Approved</option>
                <option>Pending</option>
                <option>Rejected</option>
              </select>
              <FaChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-500"
              />
            </div>
          </div>

          <div className="form-control">
            <label htmlFor="company" className="block text-sm font-medium text-gray-900 mb-2">
              Company
            </label>
            <div className="relative">
              <select
                id="company"
                name="company"
                autoComplete="company"
                className="w-full appearance-none rounded-md bg-white py-2 sm:py-1.5 pr-8 pl-3 text-sm sm:text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              >
                <option>All</option>
                <option>Approved</option>
                <option>Pending</option>
                <option>Rejected</option>
              </select>
              <FaChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-500"
              />
            </div>
          </div>

          <div className="form-control">
            <label htmlFor="position" className="block text-sm font-medium text-gray-900 mb-2">
              Position
            </label>
            <div className="relative">
              <select
                id="position"
                name="position"
                autoComplete="position"
                className="w-full appearance-none rounded-md bg-white py-2 sm:py-1.5 pr-8 pl-3 text-sm sm:text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              >
                <option>All</option>
                <option>Approved</option>
                <option>Pending</option>
                <option>Rejected</option>
              </select>
              <FaChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-4">
          <div className="form-control">
            <label htmlFor="status" className="block text-sm font-medium text-gray-900 mb-2">
              Status
            </label>
            <div className="relative">
              <select
                id="status"
                name="status"
                autoComplete="status-name"
                className="w-full appearance-none rounded-md bg-white py-2 sm:py-1.5 pr-8 pl-3 text-sm sm:text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              >
                <option>All</option>
                <option>Approved</option>
                <option>Pending</option>
                <option>Rejected</option>
              </select>
              <FaChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-500"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LeaveReport