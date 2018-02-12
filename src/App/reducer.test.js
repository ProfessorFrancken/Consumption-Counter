import { surnameRanges } from './reducer'
import { TYPES } from './../actions'
import expect from 'expect'
import faker from 'faker'

describe('Surname selection reducer', () => {
  it('should return an empty initial state', () => {
    expect(surnameRanges(undefined, {})).toEqual({
      members_per_group: 6 * 8
    })
  })

  it('groups members based on their surname', () => {
    const members = [
        { surname: 'A'},
        { surname: 'B'},
        { surname: 'C'},
        { surname: 'D'},
        { surname: 'E'},
        { surname: 'F'},
    ]

    expect(surnameRanges({ members_per_group: 6 * 8}, {
      type: TYPES.FETCH_MEMBERS_SUCCESS, members
    })).toEqual({ members_per_group: 6 * 8, groups: [
      { members, surname_start: 'A', surname_end: 'F' }
    ]})
  })

  it('uses multiple groups when not all members fit in a group', () => {
    const members = [
        { surname: 'A'},
        { surname: 'B'},
        { surname: 'C'},
        { surname: 'D'},
        { surname: 'E'},
        { surname: 'F'},
    ]

    expect(surnameRanges({ members_per_group: 3}, {
      type: TYPES.FETCH_MEMBERS_SUCCESS, members
    })).toEqual({ members_per_group: 3, groups: [
      { members: [{ surname: 'A'}, { surname: 'B'}, { surname: 'C'}],
        surname_start: 'A', surname_end: 'C' },
      { members: [{ surname: 'D'}, { surname: 'E'}, { surname: 'F'}],
        surname_start: 'D', surname_end: 'F' },
    ]})
  })
})
