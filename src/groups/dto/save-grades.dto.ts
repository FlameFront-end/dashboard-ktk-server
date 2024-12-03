export interface GradeData {
	[studentId: string]: string
}

export interface DisciplineGrades {
	[disciplineId: string]: {
		[date: string]: GradeData // Date string in 'YYYY-MM-DD' format
	}
}

export class SaveGradesDto {
	groupId: string
	weekStart: string // Date string in 'YYYY-MM-DD' format
	grades: DisciplineGrades
}
