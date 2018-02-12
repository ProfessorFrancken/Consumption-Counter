import { surnameRanges } from './reducer'
import { TYPES } from './../actions'
import expect from 'expect'
import faker from 'faker'

describe('Surname selection reducer', () => {
  it('should return an empty initial state', () => {
    expect(surnameRanges(undefined, {})).toEqual({
      members_per_range: 6 * 5,
      ranges: []
    })
  })

  it('ranges members based on their surname', () => {
    const members = [
        { surname: 'A'},
        { surname: 'B'},
        { surname: 'C'},
        { surname: 'D'},
        { surname: 'E'},
        { surname: 'F'},
    ]

    expect(surnameRanges({ members_per_range: 6 * 5}, {
      type: TYPES.FETCH_MEMBERS_SUCCESS, members
    })).toEqual({ members_per_range: 6 * 5, ranges: [
      { members, surname_start: 'A', surname_end: 'F' }
    ]})
  })

  it('uses multiple ranges when not all members fit in a range', () => {
    const members = [
        { surname: 'A'},
        { surname: 'B'},
        { surname: 'C'},
        { surname: 'D'},
        { surname: 'E'},
        { surname: 'F'},
    ]

    expect(surnameRanges({ members_per_range: 3}, {
      type: TYPES.FETCH_MEMBERS_SUCCESS, members
    })).toEqual({ members_per_range: 3, ranges: [
      { members: [{ surname: 'A'}, { surname: 'B'}, { surname: 'C'}],
        surname_start: 'A', surname_end: 'C' },
      { members: [{ surname: 'D'}, { surname: 'E'}, { surname: 'F'}],
        surname_start: 'D', surname_end: 'F' },
    ]})
  })
})
